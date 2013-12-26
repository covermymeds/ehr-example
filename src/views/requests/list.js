/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/requests/list.html'
], function ($, _, Backbone, template) {

    return Backbone.View.extend({
        initialize: function (options) {
            this.elem = $(template);
            this.render();

            var ids = localStorage.getObject('ids') || ['AY3MY7', 'PR6RY6', 'EY9BD9'];

            this.$('#dashboard').dashboard({
                ids: ids
            });
        }
    });

});
