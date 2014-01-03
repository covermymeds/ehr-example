/*jslint sloppy: true, nomen: true */
/*global define: false, localStorage: false */
define([
    'jquery',
    'backbone',
    'text!templates/requests/list.html'
], function ($, Backbone, template) {

    return Backbone.View.extend({
        initialize: function () {
            this.elem = $(template);
            this.render();

            var ids = localStorage.getObject('ids') || ['BE9WB4', 'WF4KU6', 'KE7JD8'];

            this.$('#dashboard').dashboard({
                staging: true,
                ids: ids
            });
        }
    });

});
