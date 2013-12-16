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
            options = options || {};

            if (options.el !== undefined) {
                this.el = options.el;
            }

            this.elem = $(template);
            this.render();

            // this.$('#dashboard').dashboard();
        }
    });

});