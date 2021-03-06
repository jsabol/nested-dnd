import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { ConnectedRouter } from "connected-react-router";

import { Login } from "../User";
import Nav from "./Nav";
import Explore, { Splash, PlayersPreview } from "../Explore";
import Packs, { routes as packs } from "../Packs";
import Map from "../Map";
import Account from "../Account";
import { PropsRoute, makeSubRoutes } from "../Routes";
import Universes, { routes as universes } from "../Universes";
import { history } from "./store";
import { LoadingIcon } from "../Util/Loading";
import { sendPlayersPreview, subscribeToPlayersPreview } from "../../actions/WebSocketAction";

const Characters = React.lazy(() => import("./../Characters"));
const Character = Characters.Character;

// monkey patch
if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
	const whyDidYouRender = require("@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender.min.js");
	whyDidYouRender(React);
}

const NotFound = () => (
	<div className="main">
		<div className="container mt-5">
			<h1>404 Not Found</h1>
		</div>
	</div>
);

// Create an enhanced history that syncs navigation events with the store

const LOADING_GIF = LoadingIcon;

const routes = [
	{
		path: "/account",
		component: Account
	},
	{
		path: "/map",
		component: Map
	},
	{
		path: "/packs",
		component: Packs,
		routes: packs
	},
	{
		path: "/universes",
		component: Universes,
		private: true,
		routes: universes
	},
	{
		path: "/characters",
		component: Characters,
		routes: [
			{
				path: "/:character",
				component: Character
			}
		]
	},
	{
		path: "/players-preview",
		component: PlayersPreview,
		subscribeToPlayersPreview: subscribeToPlayersPreview
	},
	{
		path: "/explore/:packurl",
		component: Explore
	}
];

export default class App extends Component {
	sendPlayersPreview = icon => sendPlayersPreview({ src: icon });

	shouldComponentUpdate(nextProps, nextState) {
		const newProps = nextProps !== this.props;
		const changedLoggedIn = nextProps.loggedIn !== this.props.loggedIn;
		return newProps || changedLoggedIn;
	}

	render() {
		const { loggedIn, loadFonts } = this.props;
		return (
			<ConnectedRouter history={history}>
				<div id="App" className="app">
					<Switch>
						<Route exact path="/players-preview" />
						<PropsRoute
							component={Nav}
							handleLogout={this.props.handleLogout}
							loggedIn={loggedIn}
						/>
					</Switch>
					{loggedIn !== null ? (
						<Switch>
							<PropsRoute
								component={loggedIn ? Universes : Splash}
								{...{ exact: true, path: "/", loadFonts, loggedIn }}
							/>
							{makeSubRoutes(routes, "", { loggedIn, loadFonts })}
							<PropsRoute path="/login" component={Login} title="Login" loggedIn={loggedIn} />
							<PropsRoute path="/signup" component={Login} title="Sign up" loggedIn={loggedIn} />
							<Route component={NotFound} />
						</Switch>
					) : null}
				</div>
			</ConnectedRouter>
		);
	}
}

export { NotFound, LOADING_GIF };
