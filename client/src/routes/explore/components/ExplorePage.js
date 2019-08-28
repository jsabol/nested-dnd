import React from "react";

import "./ExplorePage.scss";

const LOADING = (
	<div className="child col">
		<div className="child-inner loader">
			<i className="loading fa fa-spinner fa-spin" />
		</div>
	</div>
);

const ExplorePage = ({ cssClass, txt, children }) => (
	<div
		id="explorePage"
		className={`explorePage main container-fluid ${cssClass}`}
		data-bg={cssClass}
		style={{ color: txt }}
	>
		{children}
	</div>
);

export default ExplorePage;
export { LOADING };
