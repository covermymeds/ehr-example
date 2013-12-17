/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'backbone',
    'models/request',
    'localstorage'
], function (Backbone, Request) {

    return Backbone.Collection.extend({
        model: Request,
        localStorage: new Backbone.LocalStorage('Requests')
    });

});

