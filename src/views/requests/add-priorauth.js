/*jslint sloppy: true, nomen: true */
/*global window: false, define: false, localStorage: false, alert: false */

/**
 * This view handles creating a PA request by displaying a form
 * with patient/drug/form information.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/requests/add-priorauth.html'
], function ($, _, Backbone, template) {

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
                staging: true,
                success: function (data) {
                    var ids = localStorage.getObject('ids') || [];
                    ids.push(data.request.id);
                    localStorage.setObject('ids', ids);

                    self.flash('success', 'Your prescription was created successfully.');

                    window.app.navigate('dashboard', { trigger: true });
                },
                error: function () {
                    self.alert('danger', 'There was a problem creating your prescription, please try again');
                }
            });

            var datepicker = this.$('#date_of_birth').datepicker({
                format: 'mm/dd/yyyy'
            }).on('changeDate', function (ev) {
                datepicker.hide();
            }).data('datepicker');
        },

        /* Remove custom event handlers/plugins */
        onClose: function () {
            this.$('#date_of_birth').off();
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

