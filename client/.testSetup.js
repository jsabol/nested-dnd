var enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');

require('babel-register')();
require('ignore-styles');
require('es6-promise').polyfill();
require('isomorphic-fetch');

enzyme.configure({ adapter: new Adapter() });


var jsdom = require('jsdom').jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

var documentRef = document;


