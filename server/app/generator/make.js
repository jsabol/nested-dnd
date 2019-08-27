const DiceExpression = require("dice-expression-evaluator");
const mongoose = require("mongoose");

const Nested = require("../pack/Nested");

var Maker = {
	/**
	 * Creates a random version of a generator
	 * @param  {Object|Generator} gen         the generator
	 * @param  {Integer} generations the number of nested levels to generate
	 * @param  {BuiltPack} builtpack        the compiled built pack with combined definitions of generators to use
	 * @param {Object} node the pre-existing node that we are generating children for
	 * @return {Nested}             the node that will be passed to the user
	 */
	make: async function(gen, generations, builtpack, node, ancestorData = {}) {
		if (isNaN(generations) || generations < 0) generations = 0;
		const isEmbedded = !gen.isa;

		//make into a Generator obj if not
		gen = cleanGen(gen, builtpack);
		const data = Object.assign({}, ancestorData, gen.data);

		// make a new node if doesn't exist yet
		if (!node) {
			let name = await gen.makeName(data);
			let style = await gen.makeStyle(name);
			if (!gen.desc) gen.desc = [];
			let promise = Promise.all(
				gen.desc.map(d => this.makeMixedThing(d, builtpack.model("Table"), data))
			);
			let desc = gen.desc ? await promise : undefined;
			node = new Nested(name, gen, style, desc, gen.data);
		}

		// we have to keep going on embedded generators or we will lose the definition forever
		if (!isEmbedded && (generations <= 0 || !gen.in || !gen.in.length)) return node;

		// in ---------------------------------------------
		var madeChildren;

		// make children
		await Promise.all(
			gen.in.map(c => {
				return this.makeChild(c, builtpack, generations - 1, data);
			})
		).then(result => (madeChildren = result));

		//flatten madeChildren into single array
		var flatArray = [];
		madeChildren.forEach(child => {
			flatArray = flatArray.concat(child);
		});

		let inArr = !flatArray || !flatArray.length ? undefined : flatArray;
		node.setIn(inArr);

		return node;
	},

	/**
	 * Processes the type of a child to randomly generate it
	 * @param  {Object} child       childSchema
	 * @param  {BuiltPack} builtpack   the compiled pack
	 * @param  {Integer} generations the number of nested levels to generate
	 * @return {Object[]}             an array of nodes that was generated by this child
	 */
	makeChild: async function(child, builtpack, generations, ancestorData = {}) {
		if (!child || !builtpack) return [];

		var arr = [];
		var Table = builtpack.model("Table");
		var Generator = builtpack.model("Generator");

		// wrap as a child if needed
		if (!child.model) child = new Generator({ in: [child] }).in[0];

		var amount = child.makeAmount;

		var { gen, table } = await checkTypes(child, Table, builtpack, ancestorData).catch(() => {
			amount = 0;
			return {};
		});

		if (!amount || !child.isIncluded) return [];

		for (var i = 0; i < amount; i++) {
			if (gen) {
				arr.push(await Maker.make(gen, generations, builtpack, undefined, ancestorData));
			} else if (table) {
				var result = await table.roll();
				if (typeof result === undefined) continue;
				if (typeof result === "string") result = { value: result, type: "string" };
				arr = arr.concat(await this.makeChild(result, builtpack, generations, ancestorData));
			} else if (child.value) {
				arr.push({
					name: child.value,
					up: []
				});
			}
		}

		return arr;
	},

	/**
	 * Make a thing that could be a tableid, a table, or a string
	 * @param  {string} options.type  tableid, table, or string
	 * @param  {Object|string} options.value the thing
	 * @param  {Table} Table         the table schema
	 * @return {string}              the random value
	 */
	makeMixedThing: async function(thing, Table, data = {}) {
		if (typeof thing === "string" || !thing) return thing;

		var { type, value } = thing;
		if (type === undefined || value === undefined || value === null) return value;

		// replace type and value with the data
		if (type === "data") {
			let d = data[value];
			if (!d) return value; // if we can't find the data, return the key
			type = d.type;
			value = d.value;
		}

		if (!Table && type.includes("table")) Table = getTableModel(thing, Table);
		switch (type) {
			case "table_id":
				// value is not an id
				if (!(value instanceof mongoose.Types.ObjectId || typeof value === "string")) {
					break;
				}
				var table = await Table.findById(value); // TODO
				if (table) value = await table.roll(data);
				else value = undefined;
				break;
			case "table":
				value = await rollEmbeddedTable(value, thing, Table, data);
				break;
			case "dice":
				try {
					var d = new DiceExpression(value);
					value = d.roll().roll;
				} catch (e) {
					break;
				}

				break;
		}
		return value;
	}
};

/**
 * Like makeMixedThing but it's for .in child components
 * @param  {[type]} child     [description]
 * @param  {[type]} Table     [description]
 * @param  {[type]} builtpack [description]
 * @return {[type]}           [description]
 */
async function checkTypes(child, Table, builtpack, data = {}) {
	var gen, table;

	// data, replace
	if (child.type === "data") {
		let d = data[child.value];
		if (d) child = d; // swap
	}

	// now check
	if (child.type === "table") {
		if (typeof child.value !== "object") {
			var e = new Error("Data needs cleanup - table should not be a string: ");
			e.data = child.parent().toJSON();
			throw e;
		} else table = new Table(child.value);
	} else if (child.type === "table_id") {
		table = await Table.findById(child.value);
	} else if (child.type === "generator") {
		gen = builtpack.getGen(child.value);
	} else if (child.type === "embed") {
		// embed
		gen = child.value;
	} else if (typeof child.value === "string") {
		// string
		gen = builtpack.getGen(child.value); // if this is undefined that's okay
	}
	return { gen, table };
}

function getTableModel(thing, Table) {
	if (Table) return Table;

	var parent = thing.$parent || (thing.parent && thing.parent());

	if (parent) Table = parent.model("Table");
	if (typeof thing.type === "string" && thing.type.includes("table") && !Table) {
		throw new Error("Argument Table is required");
	}

	return Table;
}

async function rollEmbeddedTable(value, thing, Table, data) {
	if (typeof value === "object" && !(value instanceof Array)) {
		var table = new Table(value);
		value = await table.roll(data);
	} else {
		//console.error("Data needs cleanup - table should not be a string: ");
		//var parent = thing.$parent || thing.parent();
		//console.error(parent.toJSON());
		value = value.toString();
	}
	return value;
}

/**
 * Extends if needs to
 * @param  {[type]} genData   [description]
 * @param  {[type]} builtpack [description]
 * @return {[type]}           [description]
 */
function cleanGen(genData, builtpack) {
	if (!genData) {
		throw new Error("make(): genData cannot be undefined");
	}

	if (genData.chooseRandom) {
		var choices = [];
		for (var isa in builtpack.generators) {
			if (builtpack.generators[isa].extends === genData.isa) choices.push(isa);
		}
		if (choices.length) {
			isa = choices[Math.floor(Math.random() * choices.length)];
			genData = builtpack.getGen(isa);
			return cleanGen(genData, builtpack);
		}
	}

	var gen;
	if (!genData.save) {
		var Generator = builtpack.model("Generator");
		gen = new Generator(genData);

		// SHOULD NOT EXTEND ON THE FLY
		// gen = gen.extend(builtpack);
	} else gen = genData;

	// this is an embedded generator, we need to extend
	if (!gen.isa) {
		gen = gen.extend(builtpack);
	}

	return gen;
}
module.exports = Maker;