/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'backbone',
    'models/patient',
    'localstorage'
], function (Backbone, Patient) {

    return Backbone.Collection.extend({
        model: Patient,
        localStorage: new Backbone.LocalStorage('Patients')
    });

});
