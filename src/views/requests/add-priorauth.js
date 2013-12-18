/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/requests/add-priorauth.html',
    'models/request',
    'models/patient'
], function ($, _, Backbone, template, RequestModel, PatientModel) {

    return Backbone.View.extend({
        events: {
            'click .cancel': 'cancel',
            'click .create': 'createRequest'
        },

        /* Constructor */
        initialize: function (options) {
            options = options || {};

            if (options.el !== undefined) {
                this.el = options.el;
            }

            if (options.patientsCollection !== undefined) {
                this.patientsCollection = options.patientsCollection;
            }

            this.template = _.template(template);
            this.elem = $(this.template({ patient: new PatientModel() }));
            this.render();
        },

        /* Re-draw the view's template */
        reload: function () {
            this.elem.html(this.template({ patient: this.patient }));
        },

        /* Add custom event handlers/plugins */
        onShow: function () {
            $('#drug').drugSearch();
            $('#form').formSearch();
        },

        /* Remove custom event handlers/plugins */
        onHide: function () {
            $('#drug').drugSearch('destroy');
            $('#form').formSearch('destroy');
        },

        createRequest: function () {
            var request = new RequestModel({
                patient: {
                    first_name: this.$('input[name="request[patient][first_name]"]').val()
                }
            });

            this.patient.get('requestsCollection').add(request);
            this.trigger('view:change', 'patientShow', { reload: true });
        },

        cancel: function (event) {
            event.preventDefault();
            this.trigger('view:change', 'index');
        }
    });

});
