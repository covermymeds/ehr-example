/*jslint sloppy: true, nomen: true */
/*global require: false */
require({
    paths: {
        jquery: '../lib/jquery-1.10.2.min',
        underscore: '../lib/underscore-1.5.2.min',
        backbone: '../lib/backbone-1.1.0.min',
        bootstrap: '../lib/bootstrap-3.0.0.min',
        localstorage: '../lib/backbone.localStorage-1.1.7.min',
        cmmplugins: '../lib/api-jquery-plugins',
        cmmconfig: '../lib/config',
        select2: '../lib/select2.min',
        datatables: '../lib/jquery.dataTables.min',
        datatablesbootstrap: '../lib/datatables.bootstrap',
        bootstrapDatepicker: '../lib/bootstrap-datepicker'
    },
    shim: {
        datatables: {
            deps: ['jquery']
        },
        datatablesbootstrap: {
            deps: ['jquery', 'datatables']
        },
        cmmplugins: {
            deps: ['jquery', 'select2', 'cmmconfig']
        },
        select2: {
            deps: ['bootstrap']
        },
        localstorage: {
            deps: ['underscore', 'backbone']
        },
        bootstrap: {
            deps: ['jquery']
        },
        bootstrapDatepicker: {
            deps: ['bootstrap']
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
