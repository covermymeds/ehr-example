/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'backbone',
    'models/patient'
], function (Backbone, Patient) {

    return Backbone.Collection.extend({
        model: Patient
    });

});