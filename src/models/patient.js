/*jslint sloppy: true, nomen: true */
/*global define: false */
define([
    'backbone',
    'collections/requests'
], function (Backbone, RequestsCollection) {

    return Backbone.Model.extend({
    	  defaults: {
          first_name: 'John',
          last_name: 'Doe',
          date_of_birth: '01/01/1900',
          state: 'OH',
          requestsCollection: new RequestsCollection()
      	},
        parse: function (response, options) {
            response.requestsCollection = new RequestsCollection(response.requestsCollection);
            return response;
        }
    });

});
