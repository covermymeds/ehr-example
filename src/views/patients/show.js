/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'jquery',
    'underscore',
    'backbone',
    'models/patient',
    'text!templates/patients/show.html'
], function ($, _, Backbone, Patient, template) {

    return Backbone.View.extend({
        events: {
            'click .add': 'addRequest'
        },

        initialize: function (options) {
            options = options || {};

            if (options.el !== undefined) {
                this.el = options.el;
            }

            if (options.patientsCollection !== undefined) {
                this.patientsCollection = options.patientsCollection;
            }

            if (options.patientId !== undefined) {
                this.patientId = options.patientId;
            }

            this.template = _.template(template);
            this.elem = $(this.template({ patient: this.patientsCollection.get(this.patientId) }));
            this.render();
        },

        addRequest: function (event) {
            event.preventDefault();
            this.trigger('view:change', 'requestAdd', { patientsCollection: this.patientsCollection, patientId: this.patientId });
        }
    });

});

