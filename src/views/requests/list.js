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

            var ids = localStorage.getObject('ids') || [];

            this.$('#dashboard').dashboard({
                ids: ids
            });
        }
    });

});
