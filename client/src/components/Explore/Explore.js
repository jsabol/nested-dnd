import React, { Component } from "react";
import PropTypes from "prop-types";
import async from 'async';
import debounce from 'debounce';
import DocumentTitle from 'react-document-title';

import DB from "../../actions/CRUDAction";
import ExplorePage, { LOADING } from './ExplorePage'
import { handleNestedPropertyValue } from '../Generators/EditGenerator';

import './Explore.css';

function setBodyStyle({ cssClass = '', txt = '', up = [] } = {}){
	var body = window.document.getElementById('body');
	if(!body) return; //for tests
	var stripped = body.className.split(" ").filter(c=>(!c.startsWith('bg-') && !c.startsWith('ptn-'))).join(" ").trim();
	if(!cssClass){
		cssClass = (up[0] && up[0].cssClass) || '';
	}
	if(!txt) txt = '';
	stripped += " "+cssClass;
	body.className = stripped.trim();
	body.style.color = txt;
}

/**
 * This manages the tree data
 */
export default class Explore extends Component {
	static propTypes = {
		// should be auto-passed from router
		location: PropTypes.object.isRequired,
		match: PropTypes.object.isRequired,
		universe: PropTypes.object,
		generators: PropTypes.array,
		tables: PropTypes.array
	}
	static defaultProps = {
		universe: { pack: {} },
		generators: []
	}
	
	state = {
		current: undefined, // the current node being viewed
		lookup: {}, // a lookup of index pointers in case the user uses back/forward
		error: null,
		showAdd: false,
		pack: (this.props.universe && this.props.universe.pack) || {},
		showData: false
	}
	static contextTypes = {
		loadFonts: PropTypes.func
	}

	constructor(props){
		super(props);

		if(props.location.state){
			this.state = {...this.state, ...props.location.state};
		}

		this.saveDebounced = debounce(this.save.bind(this), 1000);
	}

	// first ajax data pull
	componentDidMount(){
		this._mounted = true;
		var index = this.getIndexFromHash(this.props);
		setBodyStyle(this.state.current);
		return this.getCurrent(this.props, index);
	}

	componentDidUpdate(prevProps, prevState){
		if(this.state.pack.font !== prevState.pack.font && this.context.loadFonts){
			this.context.loadFonts([this.state.pack.font]);
		}
	}

	saver = async.cargo((tasks, callback) => {

		var universes = {}

		tasks.forEach(t=>{
			if(!t.universe) return;

			var universe = universes[t.universe];
			if(!universe)
				universe = universes[t.universe] = { array: {} }

			var index = universe.array[t.index];
			if(!index)
				index = universe.array[t.index] = {}
			
			index[t.property] = t.value
		})
		var promises = [];

		for(var id in universes){
			var promise = DB.set(`universes`, id, universes[id]).then(({error})=>{
				if(error) this.setState({error});
			})
			promises.push(promise);
		}

		Promise.all(promises).then(callback); 
	})

	// location has changed
	UNSAFE_componentWillReceiveProps(nextProps){
		const isNewPack = (this.props.match.params.packurl !== nextProps.match.params.packurl) && (!!nextProps.match.params.packurl);;
		const isNewNode = this.state.current && "#"+this.state.current.index !== nextProps.location.hash;
		const isNewHash = this.props.location.hash !== nextProps.location.hash && nextProps.location.hash.length;

		//todo: check location state?

		// set current does the lookup
		if( isNewNode || isNewPack ){
			var index = this.getIndexFromHash(nextProps);
			if(this.state.lookup[index]){
				this.setCurrent({ current: this.state.lookup[index], error: null }, nextProps)
			}
			else if(isNewPack && this.props.location.state !== nextProps.location.state){
				this.setCurrent({ current: nextProps.location.state.current, error: null }, nextProps);
			}
			else if(isNewHash && isNewNode){ // todo: CHECK IF ONLY FIRE ON URL CLICK
				this.getCurrent(nextProps,  index);
				this.setCurrent({ current: this.state.lookup[index] || {index} })
			}
		}
	}

	shouldComponentUpdate(nextProps, nextState){
		this.makeUrlMatchCurrent(nextState, nextProps);

		const newCurrent = this.state.current !== nextState.current;
		const changedError = this.state.error !== nextState.error;
		const changedURL = this.props.match.params.universe !== nextProps.match.params.universe;
		const changedShowAdd = this.state.showAdd !== nextState.showAdd;
		const gotUniverse = this.props.universe !== nextProps.universe;
		const toggledData = this.state.showData !== nextState.showData;

		const shouldUpdate = newCurrent
			|| changedError
			|| changedURL
			|| changedShowAdd
			|| gotUniverse
			|| toggledData;

		return shouldUpdate;
	}
	
	componentWillUnmount(){
		this._mounted = false;
		// reset body background to normal on unmount
		setBodyStyle({cssClass: ''});
	}

	getCurrent(props, index, newName){
		const isUniverse = props.location.pathname.includes('universe')
		if(index === undefined) return;
		if(isNaN(index)) index = 0;

		var db = (newName) ? ()=>DB.create(props.location.pathname+"/"+index, { name: newName }) 
			: ()=>DB.get(props.location.pathname, index);

		// stop 1s timeout and do the change;
		this.saveDebounced.flush();
		var waitAfterSave = new Promise(resolve=>this.saver.push({},()=>resolve(db()))); 
		
		waitAfterSave.then(({ error, data })=>{

			// component unmounted, return
			if(!this._mounted) return;

			if(error){
				return this.setState({ error: error.display });
			}

			var { current = {} } = data;
			
			current.index = parseInt(current.index, 10);
			var lookup = this.state.lookup;
			lookup[current.index] = current;
			const oldCurrent = this.state.current;
			
			var isCurrentlyVisible = !oldCurrent 
				|| typeof oldCurrent.index === 'undefined'
				|| oldCurrent.index === current.index;

			var newState = { lookup };
			if(data.pack) 
				newState.pack = data.pack;

			if(isCurrentlyVisible){
				if(isUniverse){
					if(!(current.in instanceof Array))
						current.in = [];

					current.in.push({
						index: index+"NEW",
						isNew: true,
						cssClass: 'addNew',
						icon: 'fas fa-plus',
						in: []
					})
				}

				setBodyStyle(current);

				newState = { current, ...newState };
			}
			
			this.setState(newState);
		});
	}

	getIndexFromHash(props){
		return props.location.hash ? parseInt(props.location.hash.substr(1), 10) : "";
	}

	setCurrent(data, props){

		if(data){
			data.error = null;
			if(data.current && data.current.cssClass){ // set background
				setBodyStyle(data.current);
			}
			this.setState(data);
		}

		if(!props) props = this.props;

		var curr = data.current;
		if(curr === null) return;

		// detect if need to start the ajax call
		return this.getCurrent(props, curr.index)
	}

	// will set the history, and component will recieve the new props
	setIndex = (index, isDeleting) => {
		if(isNaN(index)) return;

		if(isDeleting && this.state.lookup[index]){
			var lookup = this.state.lookup;
			var current = lookup[index];
			current.in = current.in.filter(c=>(c && c.index !== isDeleting));
			lookup[index] = current;
			this.setState({ current: current, lookup: lookup });
		}

		if(index === 0){
			if(this.props.location.hash !== "")
				this.props.history.push(this.props.location.pathname);
		}
		else if(this.props.location.hash !== '#'+index){
			this.props.history.push('#'+index);
		}
	}

	handleRestart = (doRegenerate) => {
		const universe = this.props.match.params.universe;

		// EXPLORE 
		if(!universe){
			this.setCurrent({current: null, lookup: {}, error: null });
			this.setIndex(0);

			// reset universe
			DB.fetch('explore', "DELETE")
				.then(()=>{ return DB.fetch(this.props.location.pathname)})
				.then(({err , data})=>{
					var { current = {}, pack } = data;
					setBodyStyle(current);
					this.setState({ current: current, pack: pack, lookup:{ [data.index] : data }})

					this.setIndex(data.index);
				});
			return;
		}

		// UNIVERSE
		else{
			var confirm = window.confirm("Are you sure you want to delete this?");

			if(!confirm) return;

			const current = this.state.current;
			let index = current.index;
			let parentIndex = current.up && current.up[0] && current.up[0].index;
			let payload = {
				universe: universe,
				index: index,
				property: (doRegenerate !== true) ? 'delete' : 'regen',
				value: true
			}

			// remove any for this index in there already
			this.saver.remove(({data})=>{
				return data.universe === universe && data.index === index
			})

			if(doRegenerate !== true){
				if(parentIndex !== undefined){ // go up to parent
					this.setIndex(parentIndex, index)
				}
				else if(index !== 0){
					this.setIndex(0)
				}
				else{
					this.setCurrent({ current: { index: 0 }, lookup: {}, error: null })
				}
			}

			this.saver.push(payload);
		}
	}

	handleAdd = (child, event) => {
		if(!child.label){
			return this.setState({'showAdd': true});
		}

		// add link
		if(!isNaN(child.label)){
			var inArr = this.state.current.in || [];
			inArr = inArr.map(c=>c&&c.index).filter(c=>typeof c !== 'string').filter(ind=>ind!==null);
			inArr.push(parseInt(child.label,10));
			this.handleChange(this.state.current.index, 'in', inArr);
			this.getCurrent(this.props, this.state.current.index);
		}
		else{
			// add new thing
			this.getCurrent(this.props, this.state.current.index, child.label);

			// sort generators
			this.props.handleSortGens(child.label);
		}
	}

	handleClick = (child) => {
		var lookup = this.state.lookup;

		if(lookup[child.index]){
			child = { ...lookup[child.index], ...child};
		}
		else{
			lookup[child.index] = child;
		}

		this.setCurrent({ current: child, lookup: lookup, error: null, showAdd: false })
	}

	toggleData = () => {
		this.setState((prevState)=>({showData: !prevState.showData}));
	}

	save = (index, property, universe, payload) => {
		// remove the one that's in there already
		this.saver.remove(({data})=>{
			return data.universe === universe && data.index === index && data.property === property
		})

		this.saver.push(payload, ()=>{
			if(property === 'isFavorite') 
				this.props.handleRefresh();
		});
	}

	doSort(inArr, value){
		inArr.filter(c=>c).map(c=>c&&c.index).filter((v,i,self)=>{
			return self.indexOf(v)===i
		});
		if(inArr && inArr[inArr.length-1]  && inArr[inArr.length-1].includes('NEW'))
			inArr.splice(inArr.length-1, 1);
		var child = inArr[value.from];

		inArr.splice(value.from,1);
		inArr.splice(value.to,0,child);

		var currentInArr = this.state.current.in.filter(c=>c);
		this.setState(state=>{
			state = Object.assign({}, state);
			state.current = Object.assign({}, state.current);
			state.current.in = inArr.map(ind=>{
				return currentInArr.find(c=>c.index === ind);
			});
			state.current.in.push(currentInArr.find(c=>typeof c.index === 'string'));
			return state;
		})
		return inArr;
	}

	doDeleteLink(inArr, value){
		const currentInArr = inArr;
		var deleteIndex = value;
		
		this.setState(state=>{ 
			state = Object.assign({}, state);
			state.current = Object.assign({}, state.current);
			state.current.in = currentInArr.filter(c=>c && c.index!==deleteIndex)
			return state;
		});

		return inArr.map(c=>c&&c.index).filter(c=>c && typeof c !== 'string' && c !== deleteIndex);
	}

	handleChangeState = (oldState, index, property, value) => {
		var state = {
			...oldState,
			current: {...oldState.current}
		};
		var displayValue = value;

		// reset to parent value if reset
		if(property === 'cssClass'){
			if(value === null){
				var up = state.current.up;
				displayValue = up && up[0] && up[0][property];
				state.current.txt = up[0].txt;
			}
			state.current.savedCssClass = value ? value: undefined;
		}

		if(property === 'txt'){ //always pass cssClass with txt
			state.current.savedTxt = value;
			this.handleChange(index, 'cssClass', state.current.cssClass);
		}

		
		state.current[property] = displayValue;

		// display change
		if(property === 'cssClass' || property === 'txt'){
			setBodyStyle(state.current);
		}

			return state;
	}

	handleChange = (index, property, value) => {
		let universe = this.props.match.params.universe;
		var inArr = ([]).concat(this.state.current.in) || [];
		index = parseInt(index,10);

		if(property instanceof Array){
			let result = handleNestedPropertyValue(property, value, this.state.current);
			property = result.property;
			value = result.value;
		}

		if(property === 'sort'){
			index = this.state.current.index;
			inArr = this.doSort(inArr, value);
			property = 'in';
			value = inArr;
		}
		else if(property === 'deleteLink'){
			this.doDeleteLink(inArr, value);
			property = 'in';
			value = inArr;
		}
		else if(property === 'in'){
			value = value.filter(i=>i!==null);
		}
		else if(property === 'cssClass'){ // reset to parent value if reset
			this.handleChange(index, 'txt', null);
		}

		let payload = {
			universe: universe,
			index: index,
			property: property,
			value: value
		}

		var saveFunc = (['name','desc','data'].includes(property)) ? this.saveDebounced : this.save;

		// don't update the name field -- may mess up current typing
		// don't update the up field -- wrong format and may not have parent data
		// dont' update in field -- wrong format and changes have already taken effect
		if(property !== 'name'  && property !== 'in' && property !== 'up' && index === this.state.current.index){
			this.setState(oldState => this.handleChangeState(oldState, index, property, value));
		}

		// call the debounced versions if typing
		saveFunc(index, property, universe, payload);
	}



	makeUrlMatchCurrent(nextState, nextProps){
		const nextHash = this.getIndexFromHash(nextProps);
		const isNewIndex = nextState.current	&& nextState.current.index !== nextHash;

		//ensure that the url matches the thing being rendered
		if(isNewIndex){
			this.setIndex(nextState.current.index);
		}
	}

	render(){ 

		if(this.state.error)
			return <div className="main">{this.state.error.display}</div>;

		if(!this.state.current) 
			return <div className="main pt-5">{LOADING}</div>

		const { generators, tables, universe = {}, location: { pathname } } = this.props;
		const { showAdd, pack = {}, current, showData } = this.state;
		const { handleRestart, handleClick, handleChange, handleAdd, setIndex, toggleData } = this;
		const title = current && (current.name || current.isa);

		return (
			<DocumentTitle title={title ? title : 'Explore'}>
				<ExplorePage {...current} 
						font={pack.font} isUniverse={pathname.includes('universe')}
						location={pathname} favorites={universe.favorites} 
						{...{ generators, tables, showAdd, pack, handleRestart, handleClick, handleChange, handleAdd, setIndex, toggleData, showData }}
				/>
			</DocumentTitle>
		)
	}
}

