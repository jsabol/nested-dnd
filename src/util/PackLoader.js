import thingStore from '../stores/thingStore.js';
import tableStore from '../stores/tableStore.js';
import iconStore from '../stores/iconStore.js';

let vm = require('vm');
let gameicons = require('../_data/game-icons.json');

const DEBUG = false;

var packsAreLoaded = false;
var packsAreLoading = false;

var result = {
	defaultSeed: "",
	tables: []
};
var holdCallbacks = [];

var PackLoader = {};

var newPack = {things:{}, tables:{}};

PackLoader.packs = {};

PackLoader.packmap =  {
	"dnd": "nested-dnd-data.json,behindthetables.json,dnd.json,dnd.js",
	"nested-orteil":"nested-orteil.json,nested-orteil-extended.json"
}

class Pack{
	constructor({name, version, description, author, dependencies = [], defaultSeed, things = {}, tables = {}, beforeLoad, afterLoad}){
		this.name = name;
		this.version = version;
		this.description = description;
		this.author = author;
		this.dependencies = dependencies;
		this.defaultSeed = defaultSeed;
		this.things = things;
		this.tables = tables;
		this.beforeLoad = beforeLoad;
		this.afterLoad = afterLoad;
	}
	load(result, isTemp){
		if(typeof this.beforeLoad === "function")
			this.beforeLoad(thingStore, tableStore);

		if(this.defaultSeed)
				result.defaultSeed = this.defaultSeed;

		try{
			thingStore.addAll(this.things, isTemp);
		}catch(errorsArr){
			console.error("Errors loading things in pack "+this.name)
			errorsArr.forEach((e) => console.error(e));
		}
		
		tableStore.addAll(this.tables, isTemp);

		if(typeof this.afterLoad === "function")
			this.afterLoad(thingStore, tableStore);

		if(DEBUG) console.log("Loaded pack: "+this.name
			+"\n\t Added "+Object.keys(this.things).length+" things."
			+"\n\t Added "+Object.keys(this.tables).length+" tables.");

		return {
			things: this.things,
			tables: this.tables
		}
	}
	checkDependencies(loaded){
		var _this = this;
		this.dependencies.forEach(function(dependency){
			if(!loaded.includes(dependency))
				throw new Error(_this.name+" requires "+dependency+" to be loaded first.");
		});
	}
}

PackLoader.getPackOptions = function(){
	var options = Object.keys(PackLoader.packs).map((p)=>{return { label:p,value:p }});
	options = [{ value: 'new', label: 'create new pack' }].concat(options);
	return {
		options: options,
		complete: true
	};
}

PackLoader.getNewPack = function(){
	return newPack;
}

PackLoader.setNewPack = function(data){
	//delete
	if(data === null){
		delete localStorage.newPack;
		newPack = {things:{}, tables:{}};
		return newPack;
	}
	newPack = data;
	localStorage.newPack = JSON.stringify(data);
}

PackLoader.load = function(callback){
	if(packsAreLoaded){
		callback(result);
		return;
	}
	holdCallbacks.push(callback);
	if(packsAreLoading) return;

	packsAreLoading = true;

	new Pack(gameicons).load();
	iconStore.load();

	var packs = localStorage["packs"];
	if(!packs){
		localStorage["packs"] = packs = this.packmap["nested-orteil"];
	}
	
	packs = packs.split(",");

	//load each pack
	var numFetched = 0;
	packs.forEach(function(url, index){
		url = (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) ? url :
				process.env.PUBLIC_URL + '/packs/' + url;

		fetch(url,{ 
			headers: {
				'Pragma': 'no-cache',
		    'Cache-Control': 'no-cache'
		  }
		})
		.then(function(response){
			if(url.endsWith('.json'))
				return response.json();
			else
				return response.text();
		})
		.then(function(pack){
			if(typeof pack === "string"){
				pack = vm.runInThisContext(pack, 'remote_modules/nestedscript.js');
			}
			packs[index] = PackLoader.packs[pack.name] = new Pack(pack);
			numFetched++;

			//done
			if(numFetched === packs.length){
				var loaded = [];
				packs.forEach(function(pack){
					if(pack == null) return;
					pack.checkDependencies(loaded);
					pack.load(result);
					loaded.push(pack.name);
				})

				if(!localStorage["seed"]){
					localStorage["seed"] = result.defaultSeed;
				}

				newPack = loadNewPack();
				
				packsAreLoaded = true;
				packsAreLoading = false

				holdCallbacks.forEach((callback) => callback(result));
				holdCallbacks = [];
			}
		})
		.catch((error) => {
			numFetched++;
			packs[index] = null;
			console.error("could not load pack "+url);
			console.error(error);
		});
	});
}

function loadNewPack(){
	var newPack = {things:{}, tables:{}};
	if(localStorage.newPack){
		try{
			var pack = JSON.parse(localStorage.newPack);
			newPack = new Pack(pack).load({},true);
			if(DEBUG) console.log("PackLoader localStorage.newPack # of things "+Object.keys(newPack.things).length);
		}catch(e) {
			console.error("PackLoader -- could not parse localStorage.newPack: "+localStorage.newPack)
			console.error(e);
		}
	}
	return newPack;
}

export default PackLoader;