/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/requests/add.html'
], function ($, _, Backbone, template) {

    return Backbone.View.extend({
        events: {
            'click .cancel': 'cancel',
            'click button': 'createRequest'
        },

        initialize: function (options) {
            options = options || {};

            if (options.el !== undefined) {
                this.el = options.el;
            }

            if (options.patientsCollection !== undefined) {
                this.patientsCollection = options.patientsCollection;
            }

            this.elem = $(template);
            this.render();
        },

        createRequest: function () {
            // Probably let the jQuery plugin handle this
        },

        cancel: function (event) {
            event.preventDefault();
            this.trigger('scene:change', 'index');
        }
    });

});