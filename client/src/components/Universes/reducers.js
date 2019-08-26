import { combineReducers } from "redux";
import { spread } from "../../util";

import { RECEIVE_EXPLORE, LOAD_EXPLORE } from "../Explore/actions";
import {
	ADD,
	FETCH_UNIVERSE_START,
	FETCH_UNIVERSE_ERROR,
	FETCH_UNIVERSE_SUCCESS,
	UNIVERSES_SET,
	ERROR,
	UNIVERSE_SET,
	INSTANCE_SET,
	INSTANCE_ADD_CHILD,
	INSTANCE_DELETE,
	RECEIVE_MY_UNIVERSES
} from "./actions";

const myUniversesInitial = {
	loaded: false,
	array: []
};

function instance(state = {}, action) {
	switch (action.type) {
		case INSTANCE_ADD_CHILD:
			return { ...state, in: [...(state.in || []), "LOADING"] };
		case INSTANCE_SET:
			// deleted
			if (!action.data) return null;
			return spread(state, action.data);
		default:
			return state;
	}
}

const DEFAULT_UNIVERSE = {
	isFetching: false,
	lastUpdated: undefined,
	apiError: false,
	array: {}
};

// todo handle update other
function universe(state = DEFAULT_UNIVERSE, action) {
	const array = state.array instanceof Array ? [...state.array] : [];

	switch (action.type) {
		case FETCH_UNIVERSE_START:
			return { isFetching: true };
		case FETCH_UNIVERSE_SUCCESS:
			return {
				isFetching: false,
				apiError: false,
				lastUpdated: action.lastUpdated,
				...action.data
			};
		case FETCH_UNIVERSE_ERROR:
			return {
				...state,
				isFetching: false,
				lastUpdated: action.lastUpdated,
				apiError: action.error
			};
		case INSTANCE_DELETE:
			const toDelete = array[action.index];

			if (toDelete.up !== undefined) {
				const inArr = [...array[toDelete.up].in];
				inArr.splice(inArr.indexOf(action.index), 1);
				array[toDelete.up].in = inArr;
			}
			delete array[action.index];
			return spread(state, { array });
		case INSTANCE_ADD_CHILD:
			array[action.index] = instance(array[action.index], action);
			return spread(state, { array });
		case INSTANCE_SET:
			let index;
			for (index in action.data) {
				array[index] = instance(array[index], { ...action, data: action.data[index] });
			}
			return spread(state, { array });
		case UNIVERSE_SET:
			return spread(state, action.data);
		default:
			return state;
	}
}

function normalize(state = {}, action) {
	const u = action.data || { array: [] };

	switch (action.type) {
		case UNIVERSES_SET:
			return spread(state, u);
		default:
			return state;
	}
}

function byId(state = {}, action) {
	const copy = { ...state };
	let newState;

	switch (action.type) {
		case LOAD_EXPLORE:
			if (action.params.type === "universe") {
				if (!copy[action.params.identifier]) {
					copy[action.params.identifier] = { ...DEFAULT_UNIVERSE, isFetching: true };
				} else {
					copy[action.params.identifier].isFetching = true;
				}
			}
			return state;
		case RECEIVE_EXPLORE:
		case RECEIVE_MY_UNIVERSES:
			newState = copy;

			// data
			if (action.data instanceof Array) {
				action.data.forEach(item => {
					if (item.type === "Universe")
						newState[item.id] = { ...DEFAULT_UNIVERSE, ...item.attributes };
				});
			} else {
				if (action.data.type === "Universe")
					newState[action.data.id] = { ...DEFAULT_UNIVERSE, ...action.data.attributes };
				if (action.data.type === "Instance") {
					const universeId = action.data.attributes.univ;
					if (!newState[universeId]) newState[universeId] = DEFAULT_UNIVERSE;
					newState[universeId].array[action.data.attributes.n] = action.data.id;
				}
			}

			// included
			action.included.forEach(item => {
				if (item.type === "Instance") {
					const inst = item.attributes;
					newState[inst.univ].array[inst.n] = item.id;
				} else if (item.type === "Universe") {
					newState[item.id] = { ...DEFAULT_UNIVERSE, ...item.attributes };
				}
			});
			return newState;
		case FETCH_UNIVERSE_ERROR:
		case FETCH_UNIVERSE_START:
		case FETCH_UNIVERSE_SUCCESS:
			return { ...state, [action.id]: universe(state[action.id], action) };
		case INSTANCE_DELETE:
		case INSTANCE_ADD_CHILD:
		case INSTANCE_SET:
			return spread(state, { [action.universeId]: universe(copy[action.universeId], action) });
		case UNIVERSE_SET:
			return spread(state, { [action.data._id]: universe(copy[action.data._id], action) });
		case UNIVERSES_SET:
			let id;
			for (id in action.data) {
				const u = action.data[id];
				copy[u._id] = normalize(copy[u._id], { ...action, data: u });
			}
			return copy;
		default:
			return state;
	}
}

const DEFAULT_MY_UNIVERSES = {
	loaded: false,
	array: []
};

function myUniverses(state = DEFAULT_MY_UNIVERSES, action) {
	switch (action.type) {
		case RECEIVE_MY_UNIVERSES:
			return {
				loaded: true,
				array: action.data.map(item => item.id)
			};
		default:
			return state;
	}
}

function instances(state = {}, action) {
	let newState;
	switch (action.type) {
		case RECEIVE_EXPLORE:
		case RECEIVE_MY_UNIVERSES:
			newState = { ...state };
			if (action.data.type === "Instance") {
				newState[action.data.id] = action.data.attributes;
			}
			action.included.forEach(inst => {
				if (inst.type === "Instance") newState[inst.id] = inst.attributes;
			});
			return newState;
		default:
			return state;
	}
}

export default combineReducers({
	byId,
	myUniverses,
	instances
});
