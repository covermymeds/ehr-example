/*jslint sloppy: true, nomen: true */
/*global require: false */
require({
    paths: {
        jquery: '../lib/jquery-1.10.2.min',
        underscore: '../lib/underscore-1.5.2.min',
        backbone: '../lib/backbone-1.1.0.min',
        bootstrap: '../lib/bootstrap-3.0.0.min',
        localstorage: '../lib/backbone.localStorage-1.1.7.min',
        cmmplugins: '../lib/js-api-consumer',
        cmmconfig: '../lib/config',
        typeahead: '../lib/typeahead.min'
    },
    shim: {
        cmmplugins: {
            deps: ['jquery', 'typeahead', 'cmmconfig']
        },
        typeahead: {
            deps: ['bootstrap']
        },
        localstorage: {
            deps: ['underscore', 'backbone'],
        },
        bootstrap: {
            deps: ['jquery']
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            //These script dependencies should be loaded before loading backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the module value.
            exports: 'Backbone'
        }
    }
}, ['app']);
