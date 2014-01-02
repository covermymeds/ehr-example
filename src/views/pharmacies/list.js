/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/pharmacies/list.html',
    'datatables',
    'datatablesbootstrap'
], function ($, _, Backbone, template) {

    /**
     * Placeholder view to select a pharmacy for a specific drug/PA request
     */
    return Backbone.View.extend({
        events: {
            'click button': 'finish'
        },

        template: _.template(template),

        initialize: function (options) {
            this.el = options.el;
            this.patientsCollection = options.patientsCollection;
            this.patientId = options.patientId;

            this.elem = $(this.template({ pharmacies: ['Kroger', 'CVS', 'Walgreens', 'Walmart', 'Target'], patientId: this.patientId }));
            this.render();

            $('.dt').dataTable({
                "sDom": "<'row'<'col-lg-9'T><'col-lg-3'f>r>t<'row'<'col-lg-6'i><'col-lg-6'p>>",
                "sPaginationType": "bootstrap"
            });
        },

        finish: function (event) {
            event.preventDefault();
            window.app.navigate('patients/' + this.patientId, { trigger: true });
        }
    });

});


