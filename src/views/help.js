/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/help.html'
], function ($, _, Backbone, template) {

    return Backbone.View.extend({
        initialize: function () {
            this.elem = $(template);
            this.render();
            this.elem.showHelp();
        }
    });

});
