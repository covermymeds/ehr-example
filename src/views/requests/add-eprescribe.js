/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/requests/add-eprescribe.html',
    'models/request'
], function ($, _, Backbone, template, RequestModel) {

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

            if (options.patientId !== undefined) {
                this.patientId = options.patientId;
            }

            this.template = _.template(template);
            this.elem = $(this.template({ patient: this.patientsCollection.get(this.patientId) }));
            this.render();

            $('#drug').drugSearch();
            $('#form').formSearch();
        },

        /* Remove custom event handlers/plugins */
        onClose: function () {
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
            this.trigger('view:change', 'patientShow', { patientId: this.patientId, patientsCollection: this.patientsCollection });
        },

        cancel: function (event) {
            event.preventDefault();
            this.trigger('view:change', 'patientShow', { patientId: this.patientId, patientsCollection: this.patientsCollection });
        }
    });

});
