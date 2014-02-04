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

            var ids = localStorage.getObject('ids') || [];

            this.$('#dashboard').dashboard({
                apiId: CMM_API_CONFIG.apiId,
                apiSecret: CMM_API_CONFIG.apiSecret,
                version: 1,
                ids: ids
            });
        }
    });

});
