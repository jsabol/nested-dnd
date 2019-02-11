import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import WebFont from "webfontloader";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";

import packs from "../Packs/reducers";
import universes from "../Universes/reducers";
import user from "../User/reducers";

import { checkLoggedIn } from "../User/actions";

let history;
try {
	history = createBrowserHistory();
} catch {
	history = {};
}

const errorHandle = store => next => action => {
	try {
		next(action);
	} catch (e) {
		console.error(e);
	}
};

const middleWareArr = [thunk, routerMiddleware(history), errorHandle];

if (process.env.NODE_ENV !== "test") {
	middleWareArr.push(logger);
}

const middleware = applyMiddleware(...middleWareArr);

function loadFonts(fonts = [], source = "google") {
	if (!fonts) return;
	if (!(fonts instanceof Array)) fonts = [fonts];

	return {
		type: "LOAD_FONTS",
		fonts: fonts,
		source
	};
}

const fonts = (state = [], action = {}) => {
	const fonts = action.fonts && action.fonts.filter(f => !state.includes(f));

	switch (action.type) {
		case "LOAD_FONTS":
			// remove fonts already loaded

			if (fonts.length) {
				WebFont.load({
					[action.source]: {
						families: fonts
					}
				});
			}
			return [...state, action.fonts];
		default:
			return state;
	}
};

const app = combineReducers({
	packs,
	universes,
	user,
	fonts,
	router: connectRouter(history)
});

let store = createStore(app, {}, middleware);
store.dispatch(dispatch => checkLoggedIn(dispatch));

export default store;
export { loadFonts, history };