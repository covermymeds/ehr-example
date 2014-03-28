/*jslint sloppy: true, nomen: true */
/*global window: false, define: false, CMM_API_CONFIG: false */
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
            var requestModel,
                prescription;

            this.patientsCollection = options.patientsCollection;
            this.patientId = options.patientId;
            this.requestId = options.requestId;

            this.patient = this.patientsCollection.get(this.patientId);
            this.elem = $(this.template({ patient: this.patient }));
            this.render();

            $('#drug').drugSearch({
                apiId: CMM_API_CONFIG.apiId,
                version: 1
            });

            // Fill in values to "edit" a request
            if (this.requestId !== undefined) {
                requestModel = this.patientsCollection.get(this.patientId).get('requestsCollection').get(this.requestId);
                prescription = requestModel.get('request').prescription;

                this.$('input[name="request[prescription][quantity]"]').val(prescription.quantity);
                this.$('input[name="request[prescription][frequency]"]').val(prescription.frequency);
                this.$('select[name="request[prescription][refills]"]').val(prescription.refills);
                this.$('input[name="request[prescription][dispense_as_written]"]').attr('checked', prescription.dispense_as_written === '' ? false : true);

                switch (requestModel.get('formularyStatus')) {
                case 'Tier 3, PA':
                    this.$('#tier_3').attr('checked', 'checked');
                    break;
                case 'Tier 2, Step Therapy':
                    this.$('#tier_2').attr('checked', 'checked');
                    break;
                case 'Tier 1, Quantity Limit':
                    this.$('#tier_1').attr('checked', 'checked');
                    break;
                }

                $('#drug').select2("data", { id: requestModel.get('request').prescription.drug_id, text: requestModel.get('drugName') });
                $('#form').select2("data", { id: requestModel.get('request').form_id, text: requestModel.get('formName') });
            }
        },

        /* Remove custom event handlers/plugins */
        onClose: function () {
            $('#drug').drugSearch('destroy');
        },

        createRequest: function () {
            var requestModel,
                data,
                formularyStatuses;

            formularyStatuses = ['Tier 3, PA', 'Tier 2, Step Therapy', 'Tier 1, Quantity Limit'];

            data = {
                formName: this.$('input[name="request[form_id]"]').select2('data').text,
                drugName: this.$('input[name="request[prescription][drug_id]"]').select2('data').text,
                formularyStatus: _.sample(formularyStatuses),
                request: {
                    urgent: false,
                    form_id: this.$('input[name="request[form_id]"]').val(),
                    state: this.$('select[name="request[state]"]').val(),
                    patient: {
                        first_name: this.$('input[name="request[patient][first_name]"]').val(),
                        last_name: this.$('input[name="request[patient][last_name]"]').val(),
                        date_of_birth: this.$('input[name="request[patient][date_of_birth]"]').val(),
                        gender: Math.random() > 0.5 ? 'M' : 'F',
                        email: 'user@example.com',
                        member_id: '123456789',
                        phone_number: '555-555-5555',
                        address: {
                            street_1: '123 Main St.',
                            street_2: 'Suite #123',
                            city: 'Anytown',
                            state: this.$('select[name="request[state]"]').val(),
                            zip: '12345'
                        }
                    },
                    payer: {
                        form_search_text: 'sample plan',
                        bin: '111111',
                        pcn: 'SAMP001',
                        group_id: 'NOTREAL',
                        medical_benefit_name: 'A medical benefit',
                        drug_benefit_name: 'A drug benefit'
                    },
                    prescriber: {
                        npi: '1234567890',
                        first_name: 'John',
                        last_name: 'Doe',
                        clinic_name: 'Medicine Inc.',
                        address: {
                            street_1: '456 Main St.',
                            street_2: 'Suite #789',
                            city: 'Anytown',
                            state: this.$('select[name="request[state]"]').val(),
                            zip: '12345'
                        },
                        fax_number: '444-444-4444',
                        phone_number: '333-333-3333'
                    },
                    prescription: {
                        drug_id: this.$('input[name="request[prescription][drug_id]"]').val(),
                        refills: this.$('select[name="request[prescription][refills]"]').val(),
                        quantity: this.$('input[name="request[prescription][quantity]"]').val(),
                        dispense_as_written: this.$('input[name="request[prescription][dispense_as_written]"]').val(),
                        frequency: this.$('input[name="request[prescription][frequency]"]').val()
                    },
                    pharmacy: {
                        name: 'Small Town Drug Store',
                        address: {
                            street_1: '345 Main St.',
                            street_2: 'Suite #293',
                            city: 'Anytown',
                            state: this.$('select[name="request[state]"]').val(),
                            zip: '12345'
                        },
                        fax_number: '444-444-4444',
                        phone_number: '333-333-3333'
                    },
                    enumerated_fields: {
                        icd9_0: '327.0',
                        icd9_1: '327.1',
                        icd9_2: '327.2',
                        failed_med_0: 'Generic alternative #1',
                        failed_med_1: 'Generic alternative #2',
                        failed_med_2: 'Generic alternative #3'
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
