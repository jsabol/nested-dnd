import DB from "util/DB";

import debounce from "debounce";
import async from "async";
import {
	getUniverse,
	universeSet,
	UNIVERSE_SET,
	INSTANCE_SET,
	INSTANCE_ADD_CHILD,
	INSTANCE_DELETE
} from "store/universes";
import { getExploreUrlParams } from "store/location";
import { pushSnack } from "store/snackbar";

// Queue of save tasks
const saver = async.cargo((tasks, callback) => {
	var universes = {};

	tasks.forEach(t => {
		if (!t.universe) return;

		var universe = universes[t.universe];
		if (!universe) universe = universes[t.universe] = { array: {} };

		// updating an index
		if (t.index !== undefined) {
			var index = universe.array[t.index];
			if (!index) index = universe.array[t.index] = {};

			index[t.property] = t.value;
		}
		// updating the universe
		else {
			universe.lastSaw = t.lastSaw;
		}
	});
	var promises = [];

	for (var id in universes) {
		var promise = DB.set(`universes`, id, universes[id]).then(({ error, data = {} }) => {
			return data.result;
			//if (error).result this.setState({ error });
		});
		promises.push(promise);
	}

	Promise.all(promises).then(callback);
});

// push into the saver
const save = (index, property, universe, payload, cb) => {
	// remove the one that's in there already
	saver.remove(({ data }) => {
		return data.universe === universe && data.index === index && data.property === property;
	});

	saver.push(payload, cb);
};

const saveDebounced = debounce(save, 1000);

export const setLastSaw = (index, universeId) => {
	saver.push({
		universe: universeId,
		lastSaw: index
	});
	return universeSet(universeId, { lastSaw: index });
};

function dispatchChanges(results, universeId, dispatch, state) {
	results.forEach(({ array = {} } = {}) => {
		// save any affected instances other than the one I'm on.
		// I don't want to save the one I'm on because it may mess with my current changes.
		const current = parseInt(state.router.location.hash.substr(1));
		const changed = { ...array };
		delete changed[current];

		if (Object.keys(changed).length) {
			dispatch({ type: INSTANCE_SET, data: changed, universeId });
		}
	});
}

export const setFavorite = (i, isFavorite, universe) => {
	return (dispatch, getState) => {
		const favorites = [...universe.favorites];
		const position = favorites.indexOf(i);
		if (isFavorite) {
			if (position === -1) favorites.push(i);
		} else {
			if (position !== -1) favorites.splice(position, 1);
		}

		// save to DB
		changeInstance(i, "isFavorite", isFavorite, universe._id, dispatch);

		dispatch({
			type: UNIVERSE_SET,
			data: {
				_id: universe._id,
				favorites
			}
		});
	};
};

const changeUp = (index, universeId, newUp) => {
	const changes = {};
	const universe = getUniverse(universeId);

	// remove from old parent
	const oldUp = universe.array[index].up;
	const oldParent = universe.array[oldUp];
	changes[oldUp] = { in: oldParent.in.filter(i => i !== index) };

	// add to new parent
	const newParent = universe.array[newUp];
	changes[newUp] = { in: [...(newParent.in || []), index] };

	return changes;
};

export const changeInstance = (index, property, value, universeId) => {
	return (dispatch, getState) => {
		//debounce these properties
		const saveFunc = ["name", "desc", "data"].includes(property) ? saveDebounced : save;

		let data = {
			[index]: { [property]: value }
		};

		if (property === "up") {
			data = { ...data, ...changeUp(index, universeId, value) };
		}

		saveFunc(
			index,
			property,
			universeId,
			{ index, property, value, universe: universeId },
			(results = []) => dispatchChanges(results, universeId)
		);

		dispatch({
			type: INSTANCE_SET,
			data,
			universeId
		});
	};
};

const checkAlreadyInArr = (oldIn, index) => {
	if (oldIn.includes(index)) {
		oldIn.splice(oldIn.indexOf(index), 1);
		// check it again in case there are duplicates
		checkAlreadyInArr(oldIn, index);
	}
};

const addLink = (universe, index, child, dispatch) => {
	const oldIn = [...(universe.array[index].in || [])];

	// move to the end if it's already in the array
	checkAlreadyInArr(oldIn, child.index);

	return changeInstance(index, "in", [...oldIn, child.index], universe._id, dispatch);
};

export const addChild = (universeId, index, child) => {
	return dispatch => {
		const universe = getUniverse(universeId);

		// add link
		if (child.index !== undefined) {
			child.index = parseInt(child.index);
			if (child.index !== index && universe.array[child.index])
				return addLink(universe, index, child);

			// doesn't exist, set it as the name
			child.name = "" + child.index;
			delete child.index;
		}

		DB.create(`/universes/${universeId}/explore/${index}`, child).then(({ error, data = {} }) => {
			if (error) return;
			dispatch({ type: INSTANCE_SET, data: data.instances, universeId });
		});
		return { type: INSTANCE_ADD_CHILD, index, data: child, universeId };
	};
};

// ------------------------------------
export const LOAD_EXPLORE = "LOAD_EXPLORE";
export const RECEIVE_EXPLORE = "RECEIVE_EXPLORE";
const loadCurrent = () => {
	return async (dispatch, getState) => {
		const state = getState();
		const {
			match: {
				params: { type, id: identifier }
			},
			index
		} = getExploreUrlParams(state);

		dispatch({
			type: LOAD_EXPLORE,
			params: { type, identifier },
			index
		});

		const item = type === "pack" ? state.packs.byUrl[identifier] : state.universes.byId[identifier];

		const notLoaded = !item || !item.loaded;
		if (notLoaded) {
			let url = `/explore/${type}/${identifier}`;
			// don't send me back the whole universe, just the current instances
			if (index !== undefined) url += `/${index}`;

			const json = await DB.fetch(url);
			if (json.errors) {
				json.errors.forEach(err =>
					dispatch(pushSnack(`There was a problem retrieving this universe: ` + err))
				);
			} else {
				dispatch({
					type: RECEIVE_EXPLORE,
					...json
				});
			}
		}
	};
};

export const deleteInstance = (index, universeId, dispatch) => {
	save(
		index,
		"delete",
		universeId,
		{
			index,
			universe: universeId,
			property: "delete",
			value: true
		},
		(results = []) => dispatchChanges(results, universeId)
	);
	return {
		type: INSTANCE_DELETE,
		index,
		universeId
	};
};

export { loadCurrent };
