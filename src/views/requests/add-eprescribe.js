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
            var requestModel;

            this.patientsCollection = options.patientsCollection;
            this.patientId = options.patientId;
            this.requestId = options.requestId;

            this.patient = this.patientsCollection.get(this.patientId);
            this.elem = $(this.template({ patient: this.patient }));
            this.render();

            $('#drug').drugSearch();
            $('#form').formSearch();

            // Fill in values to "edit" a request
            if (this.requestId !== undefined) {
                requestModel = this.patientsCollection.get(this.patientId).get('requestsCollection').get(this.requestId);
                $('#drug').select2("val", requestModel.get('request.prescription.drug_id'));
                $('#form').select2("val", requestModel.get('request.form_id'));
                $('#drug').select2("data", { id: requestModel.get('request.prescription.drug_id'), text: requestModel.get('drugName') });
                $('#form').select2("data", { id: requestModel.get('request.form_id'), text: requestModel.get('formName') });
            }
        },

        /* Remove custom event handlers/plugins */
        onClose: function () {
            $('#drug').drugSearch('destroy');
            $('#form').formSearch('destroy');
        },

        createRequest: function () {
            var requestModel;

            if (this.requestId !== undefined) {
                requestModel = this.patientsCollection.get(this.patientId).get('requestsCollection').get(this.requestId);

                requestModel.save({
                    formName: this.$('input[name="request[form_id]"]').select2('data').text,
                    drugName: this.$('input[name="request[drug_id]"]').select2('data').text,
                    request: {
                        prescription: {
                            drug_id: this.$('input[name="request[drug_id]"]').val()
                        },
                        form_id: this.$('input[name="request[form_id]"]').val(),
                        patient: {
                            first_name: this.$('input[name="request[patient][first_name]"]').val(),
                            last_name: this.$('input[name="request[patient][last_name]"]').val(),
                            date_of_birth: this.$('input[name="request[patient][date_of_birth]"]').val(),
                            state: this.$('select[name="request[state]"]').val()
                        }
                    }
                });
            } else {
                requestModel = new RequestModel({
                    formName: this.$('input[name="request[form_id]"]').select2('data').text,
                    drugName: this.$('input[name="request[drug_id]"]').select2('data').text,
                    request: {
                        prescription: {
                            drug_id: this.$('input[name="request[drug_id]"]').val()
                        },
                        form_id: this.$('input[name="request[form_id]"]').val(),
                        patient: {
                            first_name: this.$('input[name="request[patient][first_name]"]').val(),
                            last_name: this.$('input[name="request[patient][last_name]"]').val(),
                            date_of_birth: this.$('input[name="request[patient][date_of_birth]"]').val(),
                            state: this.$('select[name="request[state]"]').val()
                        }
                    }
                });

                this.patient.get('requestsCollection').add(requestModel);
            }

            this.trigger('view:change', 'patientShow', { patientId: this.patientId, patientsCollection: this.patientsCollection });
        },

        cancel: function (event) {
            event.preventDefault();
            this.trigger('view:change', 'patientShow', { patientId: this.patientId, patientsCollection: this.patientsCollection });
        }
    });

});
