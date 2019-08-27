const mongoose = require("mongoose");

const Pack = require("../pack/Pack");
const Universe = require("../universe/Universe");
const Table = require("../table/Table");
const Character = require("../character/Character");

const { getUser } = require("../user/query");
const { USER_NOT_LOGGED_IN, USER_FORBIDDEN } = require("../user/messages");
const { UNAUTHORIZED, FORBIDDEN, NOT_FOUND, SERVER_ERROR } = require("../util/status");
const toJSON = require("./toJSON");

const MW = {
	isLoggedIn: function(req, res, next) {
		// do any checks you want to in here

		// CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
		// you can do this however you want with whatever variables you set up
		if (req.isAuthenticated()) return next();

		// IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
		res.status(UNAUTHORIZED).json({ errors: [{ title: USER_NOT_LOGGED_IN }] });
		return false;
	},

	isAdmin: function(req, res, next) {
		if (!MW.isLoggedIn(req, res, next)) return false;

		if (req.user.role === "administrator") {
			return next();
		}

		res.status(FORBIDDEN).json({ errors: [{ title: USER_FORBIDDEN }] });
	},

	canViewTable: function(req, res, next) {
		return Table.findById(req.params.table)
			.exec()
			.then(table => {
				if (!table) return res.status(404);

				if (!table.public && (!req.user || table.user.toString() !== req.user.id))
					return res.status(FORBIDDEN).json({ errors: [{ title: USER_FORBIDDEN }] });

				req.table = table;
				next();
			})
			.catch(next);
	},

	canEditTable: function(req, res, next) {
		if (!MW.isLoggedIn(req, res, next)) return false;

		return Table.findById(req.params.table)
			.exec()
			.then(table => {
				if (!table) return res.status(NOT_FOUND);

				if (!req.user || table.user.toString() !== req.user.id)
					return res.status(FORBIDDEN).json({ errors: [{ title: USER_FORBIDDEN }] });

				req.table = table;
				next();
			})
			.catch(next);
	},

	canViewPack: function(req, res, next) {
		return getPack(req, res, () => {
			if (!req.pack) return;

			// TODO: security hole?
			if (
				req.pack.public ||
				req.pack.universe_id ||
				(req.user && req.pack._user.id === req.user.id)
			) {
				return next();
			} else {
				return res.status(FORBIDDEN).json({ errors: [{ title: USER_FORBIDDEN }] });
			}
		});
	},

	ownsUniverse: function(req, res, next) {
		if (!MW.isLoggedIn(req, res, next)) return false;

		var getProperties =
			req.params.index !== undefined || req.url.includes("/explore")
				? undefined
				: "title user_id pack favorites array";

		Universe.findById(req.params.universe, getProperties)
			.populate("pack")
			.then(async universe => {
				if (!universe) return res.status(NOT_FOUND).send();
				if (!req.user || universe.user_id.toString() !== req.user.id) {
					return res.status(FORBIDDEN).json({ errors: [{ title: USER_FORBIDDEN }] });
				}
				req.universe = universe;
				req.universe.pack = universe.pack;
				next();
			})
			.catch(next);
	},

	ownsCharacter: function(req, res, next) {
		if (!MW.isLoggedIn(req, res, next)) return false;

		Character.findById(req.params.character)
			.populate("universe", "_id pack")
			.then(async char => {
				if (!char) return res.status(404).send();
				if (!req.user || char.user.toString() !== req.user.id) {
					return res.status(FORBIDDEN).json({ errors: [{ title: USER_FORBIDDEN }] });
				}
				req.character = char;
				next();
			})
			.catch(next);
	},

	canEditPack: function(req, res, next) {
		if (!MW.isLoggedIn(req, res, next)) return false;

		if (!req.isAuthenticated())
			res.status(401).json({ error: "You need to be logged in to edit packs." });

		return getPack(req, res, () => {
			if (!req.pack) return;

			// TODO: security issue?
			if (req.pack.universe_id || (req.user && req.pack._user.id === req.user.id)) {
				return next();
			} else {
				return res.status(401).json({ error: "You do not have permission to edit this pack" });
			}
		});
	},

	errorHandler: function(err, req, res, next) {
		// headers already sent, continue
		if (res.headersSent) {
			return next(err);
		}

		if (err.status)
			// user error
			res.status(err.status);
		else {
			res.status(SERVER_ERROR);
			console.error(err); // internal error
			console.error(err.fileName + " | col:" + err.columnNumber + " | line:" + err.lineNumber); // internal error
			console.error(err.stack);
		}

		var errJSON = toJSON(err);

		if (errJSON.errmsg) {
			errJSON.message = err.errmsg;
			delete errJSON.errmsg;
		}

		return res.json({
			errors: [
				{
					title: err.message,
					source: err.stack,
					meta: err.data
				}
			]
		});
	},

	getLoggedInUser: async function(req, res, next) {
		let loggedin = false;

		function get(cb) {
			if (req.sessionID) {
				req.sessionStore.get(req.sessionID, async function(err, mySession) {
					if (mySession && mySession.passport && mySession.passport.user) {
						try {
							const user = await getUser(mySession.passport.user);
							if (user) loggedin = true;
							cb();
						} catch (e) {
							cb(e);
						}
					} else {
						cb();
					}
				});
			} else {
				cb();
			}
		}

		// no logged in user
		get(e => {
			res.cookie("loggedin", loggedin);
			next(e);
		});
	}
};

/**
 * Puts the pack in the req object
 */

async function getPack(req, res, next) {
	const url = req.params.url || req.params.pack;

	if (!url) return res.status(412).json({ error: "Missing pack id" });

	let query;

	try {
		const _id = mongoose.Types.ObjectId(url);
		query = Pack.findOne().or([{ url }, { _id }]);
	} catch (e) {
		query = Pack.findOne({ url });
	}

	const pack = await query.populate("_user", "name id").exec();

	if (!pack) {
		var error = {
			error: "Couldn't find pack? " + req.params.pack + req.params.url
		};
		if (!res.headersSent) {
			res.status(404).json(error);
		}
		return next(error);
	}

	req.pack = pack;

	if (next) {
		next();
	}

	return;
}

module.exports = MW;