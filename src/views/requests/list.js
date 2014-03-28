/*jslint sloppy: true, nomen: true */
/*global define: false, localStorage: false, CMM_API_CONFIG: false */
define([
    'jquery',
    'backbone',
    'text!templates/requests/list.html'
], function ($, Backbone, template) {

    return Backbone.View.extend({
        events: {
            'click .request-details a': 'appendFakeUserData'
        },

        initialize: function () {
            this.elem = $(template);
            this.render();

            var tokenIds = localStorage.getObject('tokenIds') || [];

            this.$('#dashboard').dashboard({
                apiId: CMM_API_CONFIG.apiId,
                version: 1,
                tokenIds: tokenIds
            });
        },

        appendFakeUserData: function (event) {
            event.target.href += ['&remote_user[display_name]=EHR%20Demo%20User',
                                  '&remote_user[phone_number]=8664525017',
                                  '&remote_user[fax_number]=6153792541'].join('');
        }
    });

});
