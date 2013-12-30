/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/patients/list.html'
], function ($, _, Backbone, template) {

    return Backbone.View.extend({
        events: {
            'click .add': 'addPatient',
            'click .patient': 'showPatient'
        },
        template: _.template(template),

        initialize: function (options) {
            if (options.patientsCollection !== undefined) {
                this.patientsCollection = options.patientsCollection;
            }

            this.elem = $(this.template({ patientsCollection: this.patientsCollection }));
            this.render();
        },

        addPatient: function (event) {
            event.preventDefault();
            this.trigger('view:change', 'patientAdd', { patientsCollection: this.patientsCollection });
        },

        showPatient: function (event) {
            event.preventDefault();

            var patientId = $(event.target).data('id');

            this.trigger('view:change', 'patientShow', { patientId: patientId, patientsCollection: this.patientsCollection });
        }
    });

});
