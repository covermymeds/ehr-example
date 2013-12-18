/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'jquery',
    'underscore',
    'backbone',
    'models/patient',
    'text!templates/patients/add.html'
], function ($, _, Backbone, Patient, template) {

    return Backbone.View.extend({
        events: {
            'click .cancel': 'cancel',
            'click .create': 'create'
        },

        initialize: function (options) {
            options = options || {};

            if (options.el !== undefined) {
                this.el = options.el;
            }

            if (options.patientsCollection !== undefined) {
                this.patientsCollection = options.patientsCollection;
            }

            this.template = _.template(template);
            this.elem = $(this.template({ patientsCollection: this.patientsCollection }));
            this.render();
        },

        create: function (event) {
            // Add patient
            var patient = new Patient({
                first_name: this.$('input[name="patient[first_name]"]').val(),
                last_name: this.$('input[name="patient[last_name]"]').val(),
                date_of_birth: this.$('input[name="patient[date_of_birth]"]').val(),
                state: this.$('select[name="patient[state]"]').val()
            });

            // TODO: Get this working with localStorage Backbone.js plugin
            //patient.save();

            this.patientsCollection.add(patient);

            // Clear out form
            this.$('input').val('');
            this.$('select').val('');

            this.trigger('view:change', 'patientList', { patientsCollection: this.patientsCollection });
        },

        cancel: function (event) {
            this.trigger('view:change', 'patientList', { patientsCollection: this.patientsCollection });
        }
    });

});
