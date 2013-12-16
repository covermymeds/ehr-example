/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/patients/add.html'
], function ($, _, Backbone, template) {

    return Backbone.View.extend({
        events: {
            'click .cancel': 'cancel',
            'click button': 'createPatient'
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

        createPatient: function () {
            // Add patient
            // this.patientsCollection.add(new Patient({ first_name: 'blah' }));

            // Clear out form
            // this.$('input').val('');
        },

        cancel: function (event) {
            event.preventDefault();
            this.trigger('scene:change', 'patientList');
        }
    });

});