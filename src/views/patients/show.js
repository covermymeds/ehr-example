/*jslint sloppy: true, nomen: true */
/*global window: false, define: false, localStorage: false, CMM_API_CONFIG: false */
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

            // Still take user to pharmacy list, even if not starting PA requests
            if (total === 0) {
                window.app.navigate('patients/' + self.patientId + '/pharmacies', { trigger: true });
                return;
            }

            // Create a PA request for each checked checkbox
            this.$('input[name="request"]:checked').each(function (index, checkbox) {
                var requestId,
                    requestModel,
                    requestData;

                requestId = $(checkbox).val();
                requestModel = self.patient.get('requestsCollection').get(requestId);
                requestData = requestModel.get('request');

                button.createRequest({
                    apiId: CMM_API_CONFIG.apiId,
                    apiSecret: CMM_API_CONFIG.apiSecret,
                    version: 1,
                    data: { request: requestData },
                    success: function (data) {
                        var id,
                            savedIds,
                            row;

                        // Persist data locally
                        requestModel.save({
                            request: data.request,
                            sent: true
                        });

                        self.patient.save();

                        // Add the new request ID to localstorage, so we can view it in our dashboard
                        id = data.request.id;
                        savedIds = localStorage.getObject('ids') || [];
                        savedIds.push(id);
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
                            self.flash('success', 'We have started ' + count + ' prior authorization(s). You may view them <a href="#dashboard">here</a>.');
                            window.app.navigate('patients/' + self.patientId + '/pharmacies', { trigger: true });
                        }
                    },
                    error: function () {
                        // Remove temporary button
                        button.remove();

                        // Increase the # of completed callbacks
                        count += 1;

                        // Transfer to new view if all requests were successful
                        if (count === total) {
                            self.flash('danger', 'There was a problem creating one or more of your prescriptions. Please try again.');
                            window.app.navigate('patients/' + self.patientId + '/pharmacies', { trigger: true });
                        }
                    }
                });

                // "click" the temporary button that submits the request
                button.trigger('click');
            });
        }

    });
});

