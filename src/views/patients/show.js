/*jslint sloppy: true, nomen: true */
/*global define: false, localStorage: false, alert: true */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/patients/show.html'
], function ($, _, Backbone, template) {

    return Backbone.View.extend({
        events: {
            'click .add': 'addRequest',
            'click .start': 'createRequest'
        },

        template: _.template(template),

        initialize: function (options) {
            this.el = options.el;
            this.patientsCollection = options.patientsCollection;
            this.patientId = options.patientId;

            this.patient = this.patientsCollection.get(this.patientId);

            this.elem = $(this.template({ patient: this.patient }));
            this.render();
        },

        addRequest: function (event) {
            event.preventDefault();
            this.trigger('view:change', 'requestAddEPrescribe', { patientsCollection: this.patientsCollection, patientId: this.patientId });
        },

        createRequest: function (event) {
            event.preventDefault();
            var request;

            request = this.patient.get('requestsCollection').get($(event.target).data('request-id')).get('request');
            $(event.target).createRequest({
                form_id: request.form_id,
                drug_id: request.drug_id,
                first_name: request.patient.first_name,
                last_name: request.patient.last_name,
                state: request.patient.state,
                date_of_birth: request.patient.date_of_birth,
                success: function (data) {
                    var ids = localStorage.getObject('ids') || [];
                    ids.push(data.request.id);
                    localStorage.setObject('ids', ids);

                    $(event.target).attr('disabled', 'disabled').text('In Progress');
                },
                error: function (data) {
                    alert('There was an error processing your request. Please try again.');
                }
            });
        }
    });
});

