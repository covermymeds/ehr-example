/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'backbone'
], function (Backbone) {

    return Backbone.Model.extend({
    	defaults: {
    		firstName: 'John',
    		lastName: 'Doe',
    		dateOfBirth: '01/01/1900'
    	}
    });

});