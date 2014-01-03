/*jslint sloppy: true, nomen: true */
/*global window: false, define: false */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/requests/add-eprescribe.html',
    'models/request'
], function ($, _, Backbone, template, RequestModel) {

    return Backbone.View.extend({
        events: {
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
                $('#drug').select2("data", { id: requestModel.get('request').prescription.drug_id, text: requestModel.get('drugName') });
                $('#form').select2("data", { id: requestModel.get('request').form_id, text: requestModel.get('formName') });
            }
        },

        /* Remove custom event handlers/plugins */
        onClose: function () {
            $('#drug').drugSearch('destroy');
            $('#form').formSearch('destroy');
        },

        createRequest: function () {
            var requestModel,
                data;

            data = {
                formName: this.$('input[name="request[form_id]"]').select2('data').text,
                drugName: this.$('input[name="request[drug_id]"]').select2('data').text,
                request: {
                    prescription: {
                        drug_id: this.$('input[name="request[drug_id]"]').val()
                    },
                    form_id: this.$('input[name="request[form_id]"]').val(),
                    state: this.$('select[name="request[state]"]').val(),
                    patient: {
                        first_name: this.$('input[name="request[patient][first_name]"]').val(),
                        last_name: this.$('input[name="request[patient][last_name]"]').val(),
                        date_of_birth: this.$('input[name="request[patient][date_of_birth]"]').val(),
                        state: this.$('select[name="request[state]"]').val()
                    }
                }
            };

            if (this.requestId !== undefined) {
                requestModel = this.patient.get('requestsCollection').get(this.requestId);
                requestModel.save(data);
                this.flash('success', 'Prescription updated successfully.');
            } else {
                requestModel = new RequestModel(data);
                this.patient.get('requestsCollection').add(requestModel);
                this.flash('success', 'Prescription created successfully.');
            }

            this.patient.save();

            window.app.navigate('patients/' + this.patientId, { trigger: true });
        }
    });

});
