import React, { useCallback } from "react";
import Link from "components/Link";
import { doLogout } from "store/user";
import "./Nav.scss";

const LoggedOut = () => (
	<>
		<li className="nav-item">
			<Link className="nav-link mx-3" to="/login">
				Login
			</Link>
		</li>
		<li className="nav-item">
			<Link to={"/signup"}>
				<button className="btn btn-dark">Sign up</button>
			</Link>
		</li>
	</>
);
const LoggedIn = ({ handleLogout }) => (
	<>
		<li className="nav-item">
			<Link to="/account" className="nav-link">
				Account
			</Link>
		</li>
		<li className="nav-item">
			<button className="nav-link" onClick={handleLogout}>
				Logout
			</button>
		</li>
	</>
);

const Nav = ({ loggedIn, dispatch, logOutError }) => {
	const handleLogout = useCallback(() => {
		dispatch(doLogout());
	}, [dispatch]);

	return (
		<nav className="navbar navbar-dark navbar-expand-lg">
			<Link className="navbar-brand" to="/">
				Nested D&D
			</Link>
			<button
				className="navbar-toggler"
				type="button"
				data-toggle="collapse"
				data-target="#navbarToggle"
				aria-controls="navbarTogglerDemo01"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span className="navbar-toggler-icon" />
			</button>

			{/* ---------- COLLAPSING ------------*/}
			<div className="collapse navbar-collapse" id="navbarToggle">
				<ul className="navbar-nav mr-auto" />

				<ul className="navbar-nav">
					{!loggedIn ? <LoggedOut /> : <LoggedIn handleLogout={handleLogout} />}
				</ul>
			</div>
		</nav>
	);
};

export default Nav;
