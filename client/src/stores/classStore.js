class PlayerClass {
	constructor({
		name = "",
		proficiencies = {},
		spellcasting = false,
		subclasses = {},
		equipment = [],
		hit_dice = 0,
		level = [],
		main_ability = false
	}) {
		this.name = name;
		this.mainAbility = main_ability;
		this.proficiencies = proficiencies;
		this.spellcasting = spellcasting;
		this.subclasses = subclasses;
		this.equipment = equipment;
		this.hitDice = hit_dice;
		this.levels = level;
	}
	getFeaturesAtLevel(currentLevel, subclasses = {}) {
		var features = [];
		for (var i = 0; i < currentLevel; i++) {
			var level = this.levels[i];

			for (var name in level) {
				var feature = processFeature(level[name], name, subclasses);
				feature.notes = "level " + (i + 1) + " " + this.name;
				feature.className = this.name;
				features.push();
			}
		}
		return features;
	}
}

class ClassStore {
	constructor() {
		this.classes = {};
	}
	addAll(classes = {}) {
		this.classes = { ...this.classes, ...classes };
	}
	getAll() {
		var classes = {};
		for (var name in this.classes) {
			classes[name] = new PlayerClass(this.classes[name]);
		}
		return classes;
	}
	get(name) {
		if(!this.classes[name]){
			console.error("Can't find class with name "+name);
		}
		var c = this.classes[name] ? this.classes[name] : {};
		return new PlayerClass(c);
	}
	getNames() {
		return Object.keys(this.classes).sort();
	}
}

function processFeature(feature, name, subclasses){
	if (name === "slots") return;

	var desc = feature.desc;
	var ret = { ...feature, name };

	//description
	if (subclasses[name]) {
		// it is the subclass category (the superclass)
		// add the subclass choice to the desc of the superclas
		desc = (desc && desc.length) ? desc+subclasses[name] : false;
		return { ...ret, desc }
	}

	if(!feature.subclass) 
		return ret;

	if(!doInclude(feature.subclass, name, subclasses)) 
		return ret;
		
	let useDesc = desc !== false && desc === "" && feature.description;
	if(useDesc) desc = feature.description;

	return { ...ret, desc };
}

function doInclude(sc, name, subclasses){
	let subclassName = sc[sc.length-1]; // 1
	let superclassName = sc[sc.length-2]; // 0
	// it is the chosen subclass
	let isSubclass = subclasses[subclassName] === name;
	// it is a feature of the chosen subclass
	let isSubclassFeature = subclasses[superclassName] && subclasses[superclassName] === subclassName; 
	return isSubclass || isSubclassFeature;
}

class Race {
	constructor({
		name = "",
		label = "",
		proficiencies = {},
		abilities = {},
		size = "Medium",
		speed = 30,
		features = {},
		advResist = {},
		spellcasting
	}) {
		this.name = name;
		this.label = label;
		this.proficiencies = proficiencies;
		this.abilities = abilities;
		this.size = size;
		this.speed = speed;
		this.features = features;
		this.advResist = advResist;
		this.spellcasting = spellcasting;
	}
}

class RaceStore {
	constructor() {
		this.races = {};
	}
	addAll(races = {}) {
		this.races = { ...this.races, ...races };
	}
	getAll() {
		var races = {};
		for (var name in this.races) {
			races[name] = new Race(this.races[name]);
		}
		return races;
	}
	get(name) {
		var c = this.races[name] ? this.races[name] : {};
		return new Race(c);
	}
	getNames() {
		return Object.keys(this.races).sort();
	}
	getOptions() {
		var options = [];
		this.getNames().forEach(name => {
			options.push({
				label: this.races[name].name,
				value: name
			});
		});
		return options;
	}
}

class Background {
	constructor({
		name = "",
		proficiencies = {},
		size = "Medium",
		speed = 30,
		feature = {},
		advantages = {},
		equipment = []
	}) {
		this.name = name;
		this.proficiencies = proficiencies;
		this.size = size;
		this.speed = speed;
		this.feature = feature;
		this.advantages = advantages;
		this.equipment = equipment;
	}
}


class BackgroundStore {
	constructor() {
		this.backgrounds = {};
	}
	addAll(backgrounds = {}) {
		this.backgrounds = { ...this.backgrounds, ...backgrounds };
	}
	getAll() {
		var backgrounds = {};
		for (var name in this.backgrounds) {
			backgrounds[name] = new Background(this.backgrounds[name]);
		}
		return backgrounds;
	}
	get(name) {
		var c = this.backgrounds[name] ? this.backgrounds[name] : {};
		return new Background(c);
	}
	getNames() {
		return Object.keys(this.backgrounds).sort();
	}
}


let classStore = new ClassStore();
let raceStore = new RaceStore();
let backgroundStore = new BackgroundStore();
export default classStore;
export { raceStore, backgroundStore };
