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
        template: _.template(template),

        /* Constructor */
        initialize: function (options) {
            if (options.patientsCollection !== undefined) {
                this.patientsCollection = options.patientsCollection;
            }

            if (options.patientId !== undefined) {
                this.patientId = options.patientId;
            }

            this.patient = this.patientsCollection.get(this.patientId);
            this.elem = $(this.template({ patient: this.patient }));
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
                request: {
                    drug_id: this.$('input[name="request[drug_id]"]').val(),
                    form_id: this.$('input[name="request[form_id]"]').val(),
                    patient: {
                        first_name: this.$('input[name="request[patient][first_name]"]').val(),
                        last_name: this.$('input[name="request[patient][last_name]"]').val(),
                        date_of_birth: this.$('input[name="request[patient][date_of_birth]"]').val(),
                        state: this.$('select[name="request[state]"]').val()
                    }
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
