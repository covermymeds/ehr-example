/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/requests/add.html',
    'models/request'
], function ($, _, Backbone, template, RequestModel) {

    return Backbone.View.extend({
        events: {
            'click .cancel': 'cancel',
            'click .create': 'createRequest'
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
            $('#drug').drugSearch();
            $('#form').formSearch();
        },

        createRequest: function () {
            // Probably let the jQuery plugin handle this
            // $().createRequest;
            var request = new RequestModel({
                patient: {
                    first_name: this.$('input[name="request[patient][first_name]"]').val()
                }
            });

            this.patient.get('requestsCollection').add(request);
            this.trigger('scene:change', 'patientShow', { reload: true });
        },

        cancel: function (event) {
            event.preventDefault();
            this.trigger('scene:change', 'index');
        }
    });

});
