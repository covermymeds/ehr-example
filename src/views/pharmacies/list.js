/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'jquery',
    'underscore',
    'backbone',
    'datatables',
    'models/patient',
    'text!templates/pharmacies/list.html'
], function ($, _, Backbone, Patient, template) {

    /**
     * Placeholder view to select a pharmacy for a specific drug/PA request
     */
    return Backbone.View.extend({
        events: {
            'click .finish': 'finish',
            'click .cancel': 'finish'
        },

        initialize: function (options) {
            this.el = options.el;
            this.patientsCollection = options.patientsCollection;
            this.patientId = options.patientId;

            this.template = _.template(template);
            this.elem = $(this.template({ pharmacies: ['Kroger', 'CVS', 'Walgreens'] }));
            $('.dt').dataTable();
            this.render();
        },

        finish: function (event) {
            event.preventDefault();
            this.trigger('view:change', 'patientShow', { patientId: this.patientId, patientsCollection: this.patientsCollection });
        }
    });

});


