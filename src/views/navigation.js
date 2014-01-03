/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/navigation.html'
], function ($, _, Backbone, template) {

    return Backbone.View.extend({
        initialize: function (options) {
            this.elem = $(template);
            this.render();
        }
    });

});

