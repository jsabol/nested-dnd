const Schema = require("mongoose").Schema;

const Util = require('../utils');

var childSchema = Schema({
	type: {
		$type: String, // string, generator, table, embed
		require: true,
		default: "string"
	}, 
	value: { 
		$type: Schema.Types.Mixed
	},
	amount: {
		min: {
			$type: Number,
			min: 0
		},
		max: { 
			$type: Number,
			min: 1
		} //max will be empty when it's always the samae
	},
	chance: {
		$type: Number,
		min: 0,
		max: 100
	},
	isEmbedded: Boolean
}, { typeKey: '$type', _id: false });

/**
 * @return {boolean} if the child will be included in the generated object based on % chance
 */
childSchema.virtual('isIncluded').get(function(){
	if(!this.chance || this.change >= 100) 
		return true;
	return Math.random()*100<=this.chance;
});

/**
 * @return {Integer} how many copies of the child will be generated
 */
childSchema.virtual('makeAmount').get(function(){
	if(!this.amount || !this.amount.min)
		return 1;
	if(this.amount.max)
		return Util.rand(this.amount.min, this.amount.max);
	return this.amount.min;
});

module.exports = childSchema;