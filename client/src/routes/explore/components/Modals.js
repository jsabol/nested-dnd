import React from "react";

import IconSelectModal from "./ModalIconSelect";
import MoveModal from "./MoveModal";
import PatternSelectModal from "./PatternSelectModal";

export default class Modals extends React.Component {
	shouldComponentUpdate(nextProps) {
		const next = { ...nextProps, handleChange: undefined };
		const current = { ...this.props, handleChange: undefined };
		return JSON.stringify(next) !== JSON.stringify(current);
	}
	render() {
		const { handleChange, index, icon = {}, cssClass = "", txt, parent } = this.props;
		return (
			<React.Fragment>
				<MoveModal key={index + "move"} handleChange={handleChange} index={index} up={parent} />
				<IconSelectModal
					key={index + "icon"}
					{...{ ...icon, handleChange, cssClass, txt, index }}
				/>
				<PatternSelectModal
					key={index + "pattern"}
					handleChange={handleChange}
					bg={cssClass.split(" ").find(c => c.startsWith("bg-"))}
					ptn={cssClass.split(" ").find(c => c.startsWith("ptn-"))}
					index={index}
				/>
			</React.Fragment>
		);
	}
}
