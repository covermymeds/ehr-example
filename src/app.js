/*jslint sloppy: true, nomen: true, unparam: true */
/*global define: false */
define([
    'jquery',
    'bootstrap',
    'underscore',
    'backbone',
    'views/default',
    'views/patients/list',
    'views/patients/add',
    'views/patients/show',
    'views/requests/list',
    'views/requests/add-eprescribe',
    'views/requests/add-priorauth',
    'views/pharmacies/list',
    'collections/patients',
    'text!templates/navigation.html',
    'cmmplugins',
    'cmmconfig',
    'select2',
    'datatables',
    'datatablesbootstrap'
], function ($, Bootstrap, _, Backbone, DefaultView, PatientListView, PatientAddView, PatientShowView, RequestListView, RequestAddEPrescribeView, RequestAddPriorAuthView, PharmaciesListView, PatientsCollection, navigationTemplate) {
    var app,
        AppController;

    // Extend Backbone
    Backbone.View.prototype.close = function () {
        if (typeof this.onClose === "function") {
            this.onClose();
        }
        this.undelegateEvents();
        this.elem.remove();
    };

    Backbone.View.prototype.render = function () {
        this.$el.append(this.elem);
    };

    // Extend localStorage
    Storage.prototype.setObject = function (key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    };

    Storage.prototype.getObject = function (key) {
        return JSON.parse(localStorage.getItem(key));
    };

    // App
    AppController = Backbone.View.extend({
        events: {
            'click .nav a': 'navigation'
        },

        initialize: function () {
            var el,
                key;

            _.bindAll(this, 'changeView', 'navigation');

            this.elem = $(navigationTemplate);
            this.render();

            this.el = $('#page-load-target');

            this.patientsCollection = new PatientsCollection();
            this.patientsCollection.fetch();

            this.views = {
                index: DefaultView,
                patientList: PatientListView,
                patientAdd: PatientAddView,
                patientShow: PatientShowView,
                requestList: RequestListView,
                requestAddEPrescribe: RequestAddEPrescribeView,
                requestAddPriorAuth: RequestAddPriorAuthView,
                pharmaciesList: PharmaciesListView
            };

            this.activeView = new this.views.index({ el: this.el });
        },

        changeView: function (view, options) {
            options = _.extend(options || {}, { el: this.el });

            if (this.views[view] !== undefined) {
                this.activeView.off('view:change');
                this.activeView.close();

                this.activeView = new this.views[view](options);
                this.activeView.on('view:change', this.changeView);
            } else {
                alert('That view has not been defined!');
            }
        },

        navigation: function (event) {
            var view,
                options;

            view = $(event.target).attr('href');
            event.preventDefault();

            if (view === '#') {
                return;
            }

            switch (view) {
            case 'requestAdd':
            case 'patientList':
                options = { patientsCollection: this.patientsCollection }
                break;
            default:
                options = {};
                break;
            }

            this.changeView(view, options);

            // Update navigation highlight state
            this.$('.nav li').removeClass('active');
            this.$(event.target).parents('li').addClass('active');
        }
    });

    app = new AppController({ el: $('#app') });
});
