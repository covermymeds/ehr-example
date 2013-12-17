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

            this.template = _.template(template);
            this.elem = $(this.template({ patient: new Patient() }));
            this.render();
        },

        addRequest: function () {
            event.preventDefault();
            this.trigger('scene:change', 'requestAdd', { patient: this.patient });
        },

        reload: function () {
            this.patient = this.patientsCollection.get(this.id);
            this.elem.html(this.template({ patient: this.patient }));
        }
    });

});

