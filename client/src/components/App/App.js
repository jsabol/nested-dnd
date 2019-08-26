import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { connect } from "react-redux";

import { Login } from "../User";
import Nav from "./Nav";
import { Splash } from "../Explore";
import { PropsRoute, makeSubRoutes } from "../Routes";
import Universes from "../Universes";
import NotFound from "../Util/NotFound";
import Snackbar from "../Util/Snackbar";

import routes from "./routes";
import { sendPlayersPreview } from "../../actions/WebSocketAction";

class App extends Component {
	sendPlayersPreview = icon => sendPlayersPreview({ src: icon });

	shouldComponentUpdate(nextProps, nextState) {
		const newProps = nextProps !== this.props;
		const changedLoggedIn = nextProps.loggedIn !== this.props.loggedIn;
		return newProps || changedLoggedIn;
	}

	render() {
		const { loggedIn, dispatch, logOutError } = this.props;
		return (
			<div id="App" className="app">
				<Switch>
					<Route exact path="/players-preview" />
					<PropsRoute component={Nav} {...{ loggedIn, logOutError, dispatch }} />
				</Switch>
				{loggedIn !== null ? (
					<Switch>
						<PropsRoute
							component={loggedIn ? Universes : Splash}
							{...{ exact: true, path: "/", loggedIn }}
							dispatch={dispatch}
						/>
						{makeSubRoutes(routes, "", { loggedIn })}
						<PropsRoute path="/login" component={Login} title="Login" loggedIn={loggedIn} />
						<PropsRoute path="/signup" component={Login} title="Sign up" loggedIn={loggedIn} />
						<Route component={NotFound} />
					</Switch>
				) : null}
				<Snackbar />
			</div>
		);
	}
}

const mapStateToProps = state => ({
	loggedIn: state.user.loggedIn,
	logOutError: state.user.logOutError
});

export default connect(mapStateToProps)(App);
