const router = require("express").Router();

const Table = require("../models/table");
const utils = require("./middleware.js");
const merge = require("../util/merge");

// Create Table
// ---------------------------------
router.post("/create/:pack/", utils.canEditPack, (req, res, next) => {
	var newTable = req.body;
	newTable.pack = req.pack._id;
	newTable.user = req.user.id;

	Table.create(newTable)
		.then(j => res.json(j))
		.catch(next);
});

router.get("/pack/:pack/", utils.canViewPack, (req, res) => {
	Table.find({ pack: req.params.pack }).exec((err, tables) => {
		if (err) return res.status(404).json(err);
		if (!tables)
			return res.status(404).json({ error: "Couldn't find tables in pack " + req.params.pack });
		if (!tables.length) return res.json([]);

		// temp data clean
		tables.forEach(t => {
			if (!t.pack) t.set({ pack: t.packs[0] });
			t.save();
		});

		tables.sort((a, b) => a.title.localeCompare(b.title));
		return res.json(tables);
	});
});

// Read Table
// ---------------------------------
router.get("/:table", utils.canViewTable, (req, res) => {
	if (req.table && req.table.roll) {
		req.table.roll().then(result => {
			return res.json(Object.assign({}, req.table.toJSON(), { roll: result }));
		});
	} else return res.json(Object.assign({}, req.table.toJSON()));
});

// Update Table
// ---------------------------------
function updateRows(table, newRows) {
	for (let i in newRows) {
		const oldRow = (table.rows[i] && table.rows[i].toJSON()) || {};
		table.set(`rows.${i}`, newRows[i] ? merge(oldRow, newRows[i]) : null);
	}
	// loop through and remove null (deleted) rows
	let i = table.rows.length;
	while (i--) {
		if (!table.rows[i]) table.rows.splice(i, 1);
	}
}

// TODO: When renaming, fix references in all table in, as well as seed
router.put("/:table", utils.canEditTable, (req, res, next) => {
	var newVals = req.body;

	// fields that cannot be changed
	delete newVals._id; //can't modify id
	delete newVals.id; //can't modify id

	newVals.updated = Date.now();

	// rows is array, but newVals.rows comes in as an object. We need to iterate it
	if (newVals.rows) {
		updateRows(req.table, newVals.rows);
		delete newVals.rows;
	}

	req.table.set(newVals);
	req.table
		.save()
		.then(r => res.json(r))
		.catch(next);
});

// Delete Table
// ---------------------------------

router.delete("/:table", utils.canEditTable, (req, res, next) => {
	Table.deleteOne({ _id: req.params.table })
		.exec()
		.then(r => res.json(r))
		.catch(next);
});

module.exports = router;
