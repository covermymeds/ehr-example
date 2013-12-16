require({
    paths: {
        jquery: '../lib/jquery-1.10.2.min',
        underscore: '../lib/underscore-1.5.2.min',
        backbone: '../lib/backbone-1.1.0.min',
    },
    shim: {
        // Only necessary when substituting Zepto for jQuery
        //'jquery': {
        //    exports: '$'
        //},
        'underscore': {
            exports: '_'
        },
        'backbone': {
            //These script dependencies should be loaded before loading backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the module value.
            exports: 'Backbone'
        }
    }
}, ['app']);
