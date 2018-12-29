import DB from "../../actions/CRUDAction";

export const ADD = "PACKS_ADD";
export const FETCH = "PACKS_FETCH";
export const SET = "PACKS_SET";
export const ERROR = "PACKS_ERROR";

export const add = pack => ({ type: ADD, pack });

export const fetch = (dispatch, loaded) => {
	if (!loaded) {
		DB.get("packs").then(({ error, data }) => {
			if (error) dispatch(setError(error));
			else dispatch(set(data));
		});
	}
	return { type: FETCH };
};

export const setError = error => ({ type: ERROR, error });

export const set = data => ({ type: SET, data });

export default {
	add,
	fetch,
	set,
	setError
};
