import React from 'react';
import Select from 'react-select';
import {Row,Col,Form,ControlLabel,FormGroup, Button,Popover,OverlayTrigger} from 'react-bootstrap';

import PackLoader from '../../util/PackLoader.js';

const DEBUG = false;

class PackSelect extends React.Component {
	constructor(props) {
		 super(props);
		 this.state = {
			selectedPack: (localStorage.exportToPack) ? localStorage.exportToPack : "new"
		 };
		 this.export = this.export.bind(this);
		 this.updateState = this.updateState.bind(this);
		 this.loadOptions = this.loadOptions.bind(this);
	}
	loadOptions(input, callback){
		PackLoader.load(() => {
			var result = PackLoader.getPackOptions();
			if(DEBUG) console.log("PackSelect.loadOptions -- packs loaded");

			//check for selected pack
			var findSelected = result.options.find((o) => o.value === this.state.selectedPack);
			if(!findSelected){
				this.setState({
					selectedPack: "new"
				})
			}

			callback(null,result);
		});
	}
	updateState(element) {
		localStorage.exportToPack = element.value;
		this.setState({selectedPack: element});
	}
	clear(){
		var doDelete = window.confirm("Are you sure you want to delete your changes?");
		if(doDelete){
			delete localStorage.newPack;
			window.location.reload();
		}
	}
	export(){
		var packName = (this.state.selectedPack.value) ? this.state.selectedPack.value : this.state.selectedPack;
		this.props.export( (packName === "new" ) ? null : packName );
	}
	render(){
		const popoverBottom = (
			<Popover id="copiedToClipboard">Click to copy to clipboard</Popover>
		)
		return(
				<FormGroup>
					<ControlLabel>export pack:</ControlLabel>
					{' '}
					<Select.Async clearable={false}
						loadOptions={this.loadOptions}
						name="form-field-name"
						value={this.state.selectedPack}
						onChange={this.updateState}
					/>
					<OverlayTrigger trigger={["hover","focus"]} placement="bottom" overlay={popoverBottom}>
						<Button bsStyle="success" onClick={this.export}>export</Button>
					</OverlayTrigger>
					<Button bsStyle="danger" onClick={this.clear}>clear</Button>
				</FormGroup>
	 );
	}
}

export default class NewPackInfo extends React.Component{
	shouldComponentUpdate(nextProps){
		var updated = !Object.values(this.props).equals(Object.values(nextProps));
		if(DEBUG) console.log("NewPackInfo.shouldComponentUpdate: "+updated);
		return updated;
	}
	render(){
		const numThings = Object.keys(this.props.newPack.things).length;
		const numTables = Object.keys(this.props.newPack.tables).length;
		const hasData = numTables || numThings;

		if(DEBUG) console.log("NewPackInfo.RENDER: "+hasData);

		const message = (!hasData) ? <span>To change packs, click <i className="fa fa-gear"/> Settings.</span> : (
			<span>
				your new pack has <strong>{numThings}</strong> things and <strong>{numTables}</strong> tables 
			</span>
		)

		return (
		<Row id="newPackInfo" className={"alert "+(hasData ? "alert-success" : "alert-info")}>
			<Col sm={5} xs={12} className={hasData ? "animated pulse": "col-lg-12 col-md-12 col-sm-12 col-xs-12"}>{message}</Col>
			<Col sm={7} xs={12} className={hasData ? "" : "hidden"}>
				<Form inline className="pull-right">
					<PackSelect export={this.props.export} /> 
				</Form>
			</Col>
			<a id="downloadAnchorElem"> </a>
		</Row>);
	}
}