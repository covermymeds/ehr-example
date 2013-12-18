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
