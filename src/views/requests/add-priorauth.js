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
    'text!templates/requests/add-priorauth.html',
    'models/request'
], function ($, _, Backbone, template, RequestModel) {

    return Backbone.View.extend({
        events: {
            'click .cancel': 'cancel'
        },
        template: _.template(template),

        /* Constructor */
        initialize: function (options) {
            var self = this;

            if (options.patientsCollection !== undefined) {
                this.patientsCollection = options.patientsCollection;
            }

            this.elem = $(this.template());
            this.render();

            this.$('#drug').drugSearch();
            this.$('#form').formSearch();
            this.$('#create').createRequest({
                success: function (data) {
                    var ids = localStorage.getObject('ids') || [];
                    ids.push(data.request.id);
                    localStorage.setObject('ids', ids);

                    self.trigger('view:change', 'requestList');
                },
                error: function () {
                    alert('There was a problem creating your request, please try again');
                }
            });
        },

        /* Remove custom event handlers/plugins */
        onClose: function () {
            this.$('#drug').drugSearch('destroy');
            this.$('#form').formSearch('destroy');
            this.$('#create').createRequest('destroy');
        },

        /* Handle "cancel" button click */
        cancel: function (event) {
            event.preventDefault();
            this.trigger('view:change', this.previousView);
        }
    });

});

