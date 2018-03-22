const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const should = chai.should();
const sinon = require('sinon');
chai.use(chaiAsPromised);

const Generator = require('../app/models/generator');
const Pack = require('../app/models/pack');
const BuiltPack = require('../app/models/builtpack');
const Nested = require('../app/routes/packs/nested')
const Maintainer = require('../app/models/generator/maintain')
const assert = require('assert');

const builtpack = new BuiltPack({
	generators:{
		'universe': {
			isa: 'universe'
		}
	}
}) 

const pack = new Pack({
	seed: 'universe'
});

const generator = new Generator({
	isa: 'universe'
});


sinon.stub(Generator, "create").callsFake(function(data){
	return new Generator(data);
});

describe('Generator', ()=>{

	describe('makeAsRoot()', function(){

		it('should should return a node',function(){
			return Generator.makeAsRoot([generator], builtpack).should.eventually.be.an.instanceOf(Nested)
		})
	})

	describe('extend()', function(){
		var inherited = {
			style: {
				txt: { value: 'blue' },
				bg: { value: 'black' }
			}
		}
		var inheritor = {
			extends: 'inherited',
			style: {
				txt: { value: 'green' },
				icon: { value: 'fi flaticon-castle' }
			}
		}
		var builtpack;

		before(()=>{
			inherited = new Generator(inherited);
			inheritor = new Generator(inheritor);
			builtpack = new BuiltPack({
				generators: {
					inheritor: inheritor._doc,
					inherited: inherited._doc
				}
			});
		});

		it('should combine styles',()=>{
			var newGen = inheritor.extend(builtpack);
			should.exist(newGen._doc);
			newGen._doc.should.have.property('style');
			var s = newGen._doc.style._doc;

			s.should.have.property('icon').with.property('value').that.equals('fi flaticon-castle');
			s.should.have.property('txt').with.property('value').that.equals('green');
			s.should.have.property('bg').with.property('value').that.equals('black');
		})

		it('should work with no style',()=>{
			builtpack = new BuiltPack({
				generators: {
					inheritor: new Generator({extends: 'inherited'})._doc,
					inherited: new Generator()._doc
				}
			});
			var newGen = inheritor.extend(builtpack);
			should.exist(newGen._doc);
		});

		it('should work with only inherited with style',()=>{
			inheritor = new Generator({extends: 'inherited'});
			delete inheritor.style;

			builtpack = new BuiltPack({
				generators: {
					inheritor: inheritor._doc,
					inherited: inherited._doc
				}
			});
			var newGen = inheritor.extend(builtpack);
			should.exist(newGen._doc);
		});

	})

	
})