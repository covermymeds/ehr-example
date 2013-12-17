/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/requests/standaloneAdd.html',
    'models/request'
], function ($, _, Backbone, template, RequestModel) {

    return Backbone.View.extend({
        events: {
            'click .cancel': 'cancel'
        },

        initialize: function (options) {
            var self = this;

            options = options || {};

            if (options.el !== undefined) {
                this.el = options.el;
            }

            if (options.patientsCollection !== undefined) {
                this.patientsCollection = options.patientsCollection;
            }
            this.elem = $(template);
            this.render();

            $('#standalone-drug').drugSearch();
            $('#standalone-form').formSearch();
            $('#create').createRequest({
                success: function () {
                    self.trigger('scene:change', 'dashboard', { reload: true });
                },
                error: function () {
                    alert('There was a problem creating your request, please try again');
                }
            });
        },

        cancel: function (event) {
            event.preventDefault();
            this.trigger('scene:change', 'index');
        }
    });

});

