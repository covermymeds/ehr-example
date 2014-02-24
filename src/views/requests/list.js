/*jslint sloppy: true, nomen: true */
/*global define: false, localStorage: false, CMM_API_CONFIG: false */
define([
    'jquery',
    'backbone',
    'text!templates/requests/list.html'
], function ($, Backbone, template) {

    return Backbone.View.extend({
        initialize: function () {
            this.elem = $(template);
            this.render();

            var tokenIds = localStorage.getObject('tokenIds') || [];

            this.$('#dashboard').dashboard({
                apiId: CMM_API_CONFIG.apiId,
                version: 1,
                tokenIds: tokenIds
            });
        }
    });

});
