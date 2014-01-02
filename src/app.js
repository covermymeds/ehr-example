/*jslint sloppy: true, nomen: true, unparam: true */
/*global window: false, define: false, Storage: false, localStorage: false */
define([
    'jquery',
    'bootstrap',
    'underscore',
    'backbone',
    'views/default',
    'views/navigation',
    'views/patients/list',
    'views/patients/add',
    'views/patients/show',
    'views/requests/list',
    'views/requests/add-eprescribe',
    'views/requests/add-priorauth',
    'views/pharmacies/list',
    'views/help',
    'collections/patients',
    'models/patient',
    'text!templates/navigation.html',
    'cmmplugins',
    'cmmconfig',
    'select2'
], function ($, Bootstrap, _, Backbone, DefaultView, NavigationView, PatientListView, PatientAddView, PatientShowView, RequestListView, RequestAddEPrescribeView, RequestAddPriorAuthView, PharmaciesListView, HelpView, PatientsCollection, PatientModel, navigationTemplate) {

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

    // Handle matching routes to "controller" methods
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'index',
            'patients': 'patients',
            'patients/new': 'newPatient',
            'patients/:id': 'showPatient',
            'patients/:id/drugs/new': 'newDrug',
            'patients/:id/drugs/:id/edit': 'editDrug',
            'patients/:id/pharmacies': 'showPharmacies',
            'dashboard': 'dashboard',
            'requests/new': 'newRequest',
            'help': 'help'
        },

        initialize: function () {
            // Create navigation
            var nav = new NavigationView({ el: $('#app') });

            // Create initial subview
            this.el = $('#page-load-target');
            this.activeView = new DefaultView({ el: this.el });

            // Initialize collection of previously-saved patients
            this.patientsCollection = new PatientsCollection();
            this.patientsCollection.fetch({
                success: function (collection) {
                    // Create some example patients the first time the app is loaded
                    var patient,
                        names;

                    names = ['Nathan', 'Ryan', 'Larry', 'Mike', 'Mark', 'Becky', 'Suzy', 'Amanda', 'Amber'];

                    while (collection.length < 10) {
                        patient = new PatientModel({
                            first_name: _.sample(names),
                            last_name: _.sample(names)
                        });
                        collection.add(patient);
                        patient.save();
                    }
                }
            });
        },

        // Update navigation highlight state
        highlightNavigation: function (target) {
            var className;

            switch (target) {
            case 'Home':
                className = 'home';
                break;
            case 'e-Prescribing':
                className = 'eprescribe';
                break;
            case 'Prior Authorization':
                className = 'priorauth';
                break;
            default:
                break;
            }

            $('.nav li').removeClass('active');
            $('.nav li.' + className).addClass('active');
        },

        //
        // Route methods
        //

        // Placeholder page with some basic information
        index: function () {
            this.activeView.close();
            this.activeView = new DefaultView({ el: this.el });
            this.highlightNavigation('Home');
        },

        // Display all patients
        patients: function () {
            this.activeView.close();
            this.activeView = new PatientListView({ el: this.el, patientsCollection: this.patientsCollection });
            this.highlightNavigation('e-Prescribing');
        },

        // Show details of a specific patient
        showPatient: function (id) {
            this.activeView.close();
            this.activeView = new PatientShowView({ el: this.el, patientId: id, patientsCollection: this.patientsCollection });
            this.highlightNavigation('e-Prescribing');
        },

        // Create a new patient entry
        newPatient: function () {
            this.activeView.close();
            this.activeView = new PatientAddView({ el: this.el, patientsCollection: this.patientsCollection });
            this.highlightNavigation('e-Prescribing');
        },

        // Create a new prescription for a patient
        newDrug: function (patientId) {
            this.activeView.close();
            this.activeView = new RequestAddEPrescribeView({ el: this.el, patientsCollection: this.patientsCollection, patientId: patientId });
            this.highlightNavigation('e-Prescribing');
        },

        // Edit a prescription for a patient
        editDrug: function (patientId, requestId) {
            this.activeView.close();
            this.activeView = new RequestAddEPrescribeView({ el: this.el, patientsCollection: this.patientsCollection, patientId: patientId, requestId: requestId });
            this.highlightNavigation('e-Prescribing');
        },

        // Show a list of pharmacies for a patient's prescriptions
        showPharmacies: function (patientId) {
            this.activeView.close();
            this.activeView = new PharmaciesListView({ el: this.el, patientId: patientId });
            this.highlightNavigation('e-Prescribing');
        },

        // Show all previously-created prescriptions/PA requests
        dashboard: function () {
            this.activeView.close();
            this.activeView = new RequestListView({ el: this.el });
            this.highlightNavigation('Prior Authorization');
        },

        // Add a standalone prescription/PA request
        newRequest: function () {
            this.activeView.close();
            this.activeView = new RequestAddPriorAuthView({ el: this.el });
            this.highlightNavigation('Prior Authorization');
        },

        // Display a "help!" page
        help: function () {
            this.activeView.close();
            this.activeView = new HelpView({ el: this.el });
            this.highlightNavigation('Prior Authorization');
        }
    });

    window.app = new AppRouter();
    Backbone.history.start();
});
