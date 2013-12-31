/*jslint sloppy: true, nomen: true */
/*global define: false, localStorage: false, alert: true */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/patients/show.html'
], function ($, _, Backbone, template) {

    return Backbone.View.extend({
        events: {
            'click .add': 'addRequest',
            'click .edit': 'editRequest',
            'click .submit': 'createRequests'
        },

        template: _.template(template),

        initialize: function (options) {
            this.el = options.el;
            this.patientsCollection = options.patientsCollection;
            this.patientId = options.patientId;

            this.patient = this.patientsCollection.get(this.patientId);

            this.elem = $(this.template({ patient: this.patient }));
            this.render();
        },

        addRequest: function (event) {
            event.preventDefault();
            this.trigger('view:change', 'requestAddEPrescribe', { patientsCollection: this.patientsCollection, patientId: this.patientId });
        },

        editRequest: function (event) {
            var requestId;

            event.preventDefault();

            requestId = $(event.target).data('request-id');
            this.trigger('view:change', 'requestAddEPrescribe', { patientsCollection: this.patientsCollection, patientId: this.patientId, requestId: requestId });
        },

        createRequests: function (event) {
            var button,
                self,
                count,
                total;

            event.preventDefault();

            // Create a throwaway button to bind the "create request" action to
            button = $('<button>Click me!</button>');
            self = this;

            // Hide button, since it will only be used programatically
            this.el.append(button);
            button.hide();

            // Count the number of pending requests
            count = 0;
            total = this.$('input[name="request"]:checked').length;

            // Create a PA request for each checked checkbox
            this.$('input[name="request"]:checked').each(function (index, checkbox) {
                var requestId,
                    request;

                requestId = $(checkbox).val();
                request = self.patient.get('requestsCollection').get(requestId).get('request');

                button.createRequest({
                    staging: true,
                    data: { request: request },
                    success: function (data) {
                        var id,
                            savedIds,
                            row;

                        // Persist the request ID locally
                        id = data.request.id;
                        request.save('id', id);

                        // Add the new request ID to localstorage, so we can view
                        // it in our dashboard
                        savedIds = localStorage.getObject('ids') || [];
                        savedIds.push();
                        localStorage.setObject('ids', savedIds);

                        // Hide the "change drug" button and disable the
                        // "submit drug" checkbox
                        row = $(checkbox).parents('tr');
                        row.find('button').hide();
                        row.find('input').attr('disabled', 'disabled');

                        // Remove temporary button
                        button.remove();

                        // Increase the # of completed callbacks
                        count += 1;

                        // Transfer to new view if all requests were successful
                        if (count === total) {
                            self.trigger('view:change', 'pharmaciesList', { patientsCollection: self.patientsCollection, patientId: self.patientId });
                        }
                    },
                    error: function (data) {
                        // Remove temporary button
                        button.remove();

                        // Increase the # of completed callbacks
                        count += 1;

                        // Transfer to new view if all requests were successful
                        if (count === total) {
                            alert('There was an error creating one of your prescriptions. Please try again.');
                            self.trigger('view:change', 'pharmaciesList', { patientsCollection: self.patientsCollection, patientId: self.patientId });
                        }
                    }
                });

                // "click" the temporary button that submits the request
                button.trigger('click');
            });
        }

    });
});

