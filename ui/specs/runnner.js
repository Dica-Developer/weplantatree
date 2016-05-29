'use strict';

require('babel-register')();

const jsdom = require('jsdom').jsdom;
let exposedProperties = ['window', 'navigator', 'document'];

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
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
