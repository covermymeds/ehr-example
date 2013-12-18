/*jslint sloppy: true, nomen: true */
/*global define: false */

/**
 * This view handles creating a PA request by displaying a form
 * with patient/drug/form information.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/requests/add-eprescribe.html',
    'models/request'
], function ($, _, Backbone, template, RequestModel) {

    return Backbone.View.extend({
        events: {
            'click .cancel': 'cancel'
        },

        /* Constructor */
        initialize: function (options) {
            var self = this;

            options = options || {};

            if (options.el !== undefined) {
                this.el = options.el;
            }

            if (options.patientsCollection !== undefined) {
                this.patientsCollection = options.patientsCollection;
            }

            this.template = _.template(template);
            this.elem = $(this.template());
            this.render();
        },

        /* Add custom event handlers/plugins */
        onShow: function () {
            var self = this;

            $('#standalone-drug').drugSearch();
            $('#standalone-form').formSearch();
            $('#create').createRequest({
                success: function (data) {
                    var ids = localStorage.getObject('ids') || [];
                    ids.push(data.request.id);
                    localStorage.setObject('ids', ids);

                    self.trigger('view:change', self.previousView, { reload: true });
                },
                error: function () {
                    alert('There was a problem creating your request, please try again');
                }
            });
        },

        /* Remove custom event handlers/plugins */
        onHide: function () {
            $('#standalone-drug').drugSearch('destroy');
            $('#standalone-form').formSearch('destroy');
            $('#create').createRequest('destroy');
        },

        /* Handle "cancel" button click */
        cancel: function (event) {
            event.preventDefault();
            this.trigger('view:change', this.previousView);
        }
    });

});

