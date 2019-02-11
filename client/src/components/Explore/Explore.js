import React, { Component } from "react";
import PropTypes from "prop-types";

import DocumentTitle from "react-document-title";

import DB from "../../actions/CRUDAction";
import ExplorePage, { LOADING, Data, Modals, Children } from "./ExplorePage";
import Title from "./Title";
import { handleNestedPropertyValue } from "../Generators/EditGenerator";

import "./Explore.css";
const NEW_ITEM = {
	isNew: true,
	cssClass: "addNew",
	icon: "fas fa-plus",
	in: []
};

/**
 * This manages the tree data
 */
export default class Explore extends Component {
	static propTypes = {
		// should be auto-passed from router
		location: PropTypes.object.isRequired,
		match: PropTypes.object.isRequired,
		universe: PropTypes.object,
		current: PropTypes.object
	};
	static defaultProps = {
		location: {},
		universe: { pack: {} },
		current: {}
	};

	state = {
		current: undefined, // the current node being viewed
		lookup: {}, // a lookup of index pointers in case the user uses back/forward
		error: null,
		showAdd: false,
		pack: (this.props.universe && this.props.universe.pack) || {},
		showData: false
	};

	constructor(props) {
		super(props);

		if (props.location.state) {
			this.state = { ...this.state, ...props.location.state };
		}
	}

	// first ajax data pull
	componentDidMount() {
		this._mounted = true;
		this.props.loadCurrent();

		//var index = this.getIndexFromHash(this.props);
		//setBodyStyle(this.props.current);
		this.props.loadFonts();
	}

	componentDidUpdate({ pack = {}, index, ...prevProps }) {
		// load fonts
		if (this.props.pack && this.props.pack.font !== pack.font) {
			this.props.loadFonts();
		}
		// new last saw
		if (this.props.index !== this.props.universe.lastSaw) {
			this.props.setLastSaw();
		}
		// new index
		if (this.props.index !== index) {
			if (this.props.current.todo === true) {
				this.props.loadCurrent(true);
			}
		}
		//setBodyStyle(this.props.current);
	}

	determineChange = (props, nextProps) => {
		const isNewPack =
			props.match.params.packurl !== nextProps.match.params.packurl &&
			!!nextProps.match.params.packurl;
		const isNewNode =
			this.props.current && "#" + this.props.current.index !== nextProps.location.hash;
		const isNewHash =
			props.location.hash !== nextProps.location.hash && nextProps.location.hash.length;

		return { isNewPack, isNewNode, isNewHash };
	};

	shouldComponentUpdate(nextProps, nextState) {
		const newCurrent = JSON.stringify(this.props.current) !== JSON.stringify(nextProps.current);
		const newIn = JSON.stringify(this.props.current.in) !== JSON.stringify(nextProps.current.in);
		const changedError = this.state.error !== nextState.error;
		const changedURL = this.props.match.params.universe !== nextProps.match.params.universe;
		const changedShowAdd = this.state.showAdd !== nextState.showAdd;
		const gotUniverse = JSON.stringify(this.props.universe) !== JSON.stringify(nextProps.universe);
		const gotPack = JSON.stringify(this.props.pack) !== JSON.stringify(nextProps.pack);
		const toggledData = this.state.showData !== nextState.showData;

		const shouldUpdate =
			newCurrent ||
			newIn ||
			changedError ||
			changedURL ||
			changedShowAdd ||
			gotUniverse ||
			toggledData ||
			gotPack;

		return shouldUpdate;
	}

	componentWillUnmount() {
		this._mounted = false;
		// reset body background to normal on unmount
		//setBodyStyle({ cssClass: "" });
	}

	pushCurrent = (props, index, { error, data }) => {
		// component unmounted, return
		if (!this._mounted) return;

		if (error) {
			return this.setState({ error: error.display });
		}

		const isUniverse = props.isUniverse;

		var { current = {} } = data;

		current.index = parseInt(current.index, 10);
		var lookup = this.state.lookup;
		lookup[current.index] = current;
		const oldCurrent = this.props.current;
		const oldIndex = oldCurrent && oldCurrent.index;

		var isVisible = !oldCurrent || typeof oldIndex === "undefined" || oldIndex === current.index;

		var newState = { lookup };
		if (data.pack) newState.pack = data.pack;

		if (isVisible) {
			if (isUniverse) {
				if (!(current.in instanceof Array)) current.in = [];

				current.in.push({ ...NEW_ITEM, index: index + "NEW" });
			}

			newState = { current, ...newState };
		}

		this.setState(newState);
	};

	// will set the history, and component will recieve the new props
	setIndex = (index, isDeleting) => {
		if (isNaN(index)) return;

		if (index === 0) {
			if (this.props.location.hash !== "") this.props.history.push(this.props.location.pathname);
		} else if (this.props.location.hash !== "#" + index) {
			this.props.history.push("#" + index);
		}
	};

	handleRestartExplore = () => {
		this.setCurrent({ current: null, lookup: {}, error: null });
		this.setIndex(0);

		// reset universe
		DB.fetch("explore", "DELETE")
			.then(() => DB.fetch(this.props.location.pathname))
			.then(({ err, data }) => {
				var { current = {}, pack } = data;
				this.setState({ current, pack, lookup: { [data.index]: data } });

				this.setIndex(data.index);
			});
		return;
	};

	handleRestartUniverse = (doRegenerate, universe) => {
		var confirm = window.confirm("Are you sure you want to delete this?");

		if (!confirm) return;

		const current = this.props.current;
		//let index = current.index;
		let parentIndex = current.up && current.up[0] && current.up[0].index;

		this.setIndex(parentIndex);

		this.props.handleDelete(this.props.index);
	};

	handleRestart = doRegenerate => {
		const universe = this.props.match.params.universe;

		if (!universe) this.handleRestartExplore();
		else this.handleRestartUniverse(doRegenerate, universe);
	};

	handleAdd = (child, event) => {
		if (!child.label) {
			return this.setState({ showAdd: true });
		}

		// add link
		if (!isNaN(child.label)) {
			var inArr = this.props.current.in || [];
			inArr = inArr
				.map(c => c && c.index)
				.filter(c => typeof c !== "string")
				.filter(ind => ind !== null);
			inArr.push(parseInt(child.label, 10));
			this.handleChange(this.props.current.index, "in", inArr);
			//this.getCurrent(this.props, this.props.current.index);
		}
	};

	handleClick = () => {};

	toggleData = () => {
		this.setState(prevState => ({ showData: !prevState.showData }));
	};

	doSort(inObjects = [], value) {
		if (!inObjects) return inObjects;

		// change from objects to indexes and remove new
		var inArr = inObjects
			.filter(c => c)
			.map(c => c && c.index)
			.filter((v = [], i, self) => {
				return self.indexOf(v) === i && !(v.includes && v.includes("NEW"));
			});
		var child = inArr[value.from];

		// do the move
		inArr.splice(value.from, 1);
		inArr.splice(value.to, 0, child);

		var currentInArr = this.props.current.in.filter(c => c);
		this.setState(state => {
			state = Object.assign({}, state);
			this.props.current = Object.assign({}, this.props.current);
			this.props.current.in = inArr.map(ind => {
				return currentInArr.find(c => c.index === ind);
			});
			this.props.current.in.push(currentInArr.find(c => typeof c.index === "string"));
			return state;
		});
		return inArr;
	}

	doDeleteLink(inArr, value) {
		//const currentInArr = [...inArr];
		var deleteIndex = value;

		this.setState(state => {
			state = Object.assign({}, state);
			return state;
		});

		return inArr
			.map(c => c && c.index)
			.filter(c => c && typeof c !== "string" && c !== deleteIndex);
	}

	handleChangeState = (oldState, index, property, value) => {
		const props = this.props;
		var state = {
			...oldState
		};
		var displayValue = value;

		// reset to parent value if reset
		if (property === "cssClass") {
			if (value === null) {
				var up = props.current.up;
				displayValue = up && up[0] && up[0][property];
				props.current.txt = up[0].txt;
			}
			props.current.savedCssClass = value ? value : undefined;
		}

		//always pass cssClass with txt unless resetting
		else if (property === "txt" && value !== null) {
			props.current.savedTxt = value;

			this.handleChange(index, "cssClass", props.current.cssClass);
		}

		props.current[property] = displayValue;

		return state;
	};

	handleChangeClean = (i, p, v) => {
		let index = i,
			property = p,
			value = v;

		if (index === undefined) {
			index = this.props.index;
		}

		var inArr = [].concat(this.props.current.in) || [];
		index = parseInt(index, 10);

		if (property instanceof Array) {
			let result = handleNestedPropertyValue(property, value, this.props.current);
			property = result.property;
			value = result.value;
		}

		if (property === "sort") {
			index = this.props.current.index;
			inArr = this.doSort(inArr, value);
			property = "in";
			value = inArr;
		} else if (property === "deleteLink") {
			value = this.doDeleteLink(inArr, value);
			property = "in";
		} else if (property === "in") {
			value = value.filter(i => i !== null);
		}

		return { index, property, value };
	};

	handleChange = (i, p, v) => {
		const { index, property, value } = this.handleChangeClean(i, p, v);
		this.props.handleChange(index, property, value);

		if (property === "cssClass") {
			// reset to parent value if reset
			this.props.handleChange(index, "txt", null);
		}
	};

	handleChange2 = (i, p, v) => {
		let universe = this.props.match.params.universe;
		const { index, property, value } = this.handleChangeClean(i, p, v);

		let payload = { universe, index, property, value };

		if (property === "cssClass") {
			// reset to parent value if reset
			this.handleChange(index, "txt", null);
		}

		var saveFunc = ["name", "desc", "data"].includes(property) ? this.saveDebounced : this.save;

		// don't update the name field -- may mess up current typing
		// don't update the up field -- wrong format and may not have parent data
		// dont' update in field -- wrong format and changes have already taken effect
		if (!["name", "in", "up"].includes(property) && index === this.props.current.index) {
			this.setState(oldState => this.handleChangeState(oldState, index, property, value));
		}

		// call the debounced versions if typing
		saveFunc(index, property, universe, payload);
	};

	makeUrlMatchCurrent(nextState, nextProps) {
		const nextHash = this.props.index;
		const isNewIndex = nextProps.current && nextProps.current.index !== nextHash;

		//ensure that the url matches the thing being rendered
		if (isNewIndex) {
			this.setIndex(nextProps.current.index);
		}
	}

	_getTitleProps() {
		const { pack = {}, favorites, toggleFavorite } = this.props;
		return {
			pack,
			favorites,
			toggleFavorite,
			universeId: this.props.universe._id,
			handleChange: this.handleChange,
			handleRestart: this.handleRestartUniverse,
			loaded: this.props.universe.loaded,
			isFavorite: this.props.isFavorite
		};
	}
	_getChildrenProps() {
		const { isUniverse, index, current, handleChange } = this.props;
		const { cssClass, highlightColor, in: inArr } = current;
		const { handleAdd, handleClick } = this;
		const handle = { change: handleChange, add: handleAdd, click: handleClick };
		const { generators, tables } = getGensTables(this.props.pack);
		return { isUniverse, index, cssClass, highlightColor, inArr, handle, generators, tables };
	}
	render() {
		if (this.state.error) return <div className="main">{this.state.error.display}</div>;
		if (this.props.current.loading) return <div className="main pt-5">{LOADING}</div>;

		// get props
		const { current, isUniverse, handleChange, index } = this.props,
			{ showData } = this.state,
			{ data, cssClass, up = [], icon, txt } = current,
			{ generators, tables } = getGensTables(this.props.pack),
			title = current && (current.name || current.isa),
			isLoading = current.todo === true,
			parent = up[0] && up[0].index;

		return (
			<DocumentTitle title={title ? title : "Explore"}>
				<ExplorePage cssClass={current.cssClass} txt={current.txt}>
					<div className="row">
						<Title {...{ current, title, isUniverse, ...this._getTitleProps() }} />
						<div className="col">
							{showData && <Data {...{ data, generators, tables, handleChange, index }} />}
							{isLoading && LOADING}
							<Children {...this._getChildrenProps()} />
						</div>
					</div>
					{isUniverse && <Modals {...{ handleChange, index, icon, cssClass, txt, parent }} />}
				</ExplorePage>
			</DocumentTitle>
		);
	}
}

function getGensTables(pack = {}) {
	const { builtpack = {} } = pack;
	const { generators = [], tables = [] } = builtpack;
	return { generators: Object.keys(generators).sort(), tables };
}
