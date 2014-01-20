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

            if (ids.length === 0) {
                ids = ['DJ8BX3', 'MU4AK9', 'MH8YJ8'];
                localStorage.setObject('ids', ids);
            }

            this.$('#dashboard').dashboard({
                ids: ids
            });
        }
    });

});
