import React from "react";

import { recalcFontSize, CARDS_PER_PAGE } from './CardsUtil'
import Page from './Page';

import "./Cards.css";

export default class Cards extends React.Component {
	componentDidUpdate() {
		var arr = document.getElementsByClassName("desc");
		for (var i = 0; i < arr.length; i++) {
			arr[i].style.fontSize = "14px";
			recalcFontSize(arr[i]);
		}
	}
	render() {
		if (!this.props.character || !this.props.character.cards) return <div />;

		var pages = [], cards = [];
		let c = this.props.character;
		const ALL_CARDS = c.cards.get();
		const name = (c.name) ? c.name+" "+LVL: c.classes[0].name+" "+c.getTotalLevel();

		for (var i = 0; i < ALL_CARDS.length; i++) {
			cards.push(ALL_CARDS[i]);
			if (
				cards.length === CARDS_PER_PAGE ||
				(ALL_CARDS.length && i === ALL_CARDS.length - 1)
			) {
				pages.push(
					<Page cards={cards} side="front" key={pages.length} name={name} />
				);
				cards = [];
			}
		}
		return <div>{pages}</div>;
	}
}