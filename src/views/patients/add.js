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

            this.elem = $(template);
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

            //patient.save();

            this.patientsCollection.add(patient);

            // Clear out form
            this.$('input').val('');
            this.$('select').val('');

            this.trigger('scene:change', 'patientList', { reload: true  });
        },

        cancel: function (event) {
            this.trigger('scene:change', 'patientList');
        }
    });

});
