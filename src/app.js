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
    'select2',
    'bootstrapDatepicker'
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

        // Display flash message
        var flash = localStorage.getObject('flash');

        if (flash !== null) {
            this.alert(flash.type, flash.text);

            // Clear out message
            localStorage.setObject('flash', null);
        }
    };

    Backbone.View.prototype.alert = function (type, text) {
        // Allowed types: success, info, warning, danger
        var html = $('<div class="alert alert-' + type + ' alert-dismissable">' +
                      '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
                      text +
                    '</div>');
        $('a', html).addClass('alert-link');
        this.elem.prepend(html);
        html.alert();
        html.hide();
        html.fadeIn();
    };

    Backbone.View.prototype.flash = function (type, text) {
        localStorage.setObject('flash', { type: type, text: text });
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
            'patients/:id/destroy': 'destroyPatient',
            'dashboard': 'dashboard',
            'requests/new': 'newRequest',
            'help': 'help'
        },

        initialize: function () {
            var nav;

            // Clear out any previous flash messages
            localStorage.setObject('flash', null);

            // Add some example requests to display in the dashboard
            if (localStorage.getObject('tokenIds') === null) {
                localStorage.setObject('tokenIds', ['gq9vmqai2mkwewv1y55x', '33lhqakhtmas8r965w39', 's4c85zi3ku0b9re5sg1o']);
            }

            // Create navigation
            nav = new NavigationView({ el: $('#app') });

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

                    if (collection.length === 0) {
                        while (collection.length < 10) {
                            patient = new PatientModel({
                                first_name: _.sample(names),
                                last_name: _.sample(names)
                            });
                            collection.add(patient);
                            patient.save();
                        }
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
        showPatient: function (patientId) {
            // If patient has no drugs, forward on immediately to "Add drug" view
            var patient = this.patientsCollection.get(patientId);
            if (patient.get('requestsCollection').length === 0) {
                window.app.navigate('/patients/' + patientId + '/drugs/new', { trigger: true, replace: true });
                return;
            }

            this.activeView.close();
            this.activeView = new PatientShowView({ el: this.el, patientId: patientId, patientsCollection: this.patientsCollection });
            this.highlightNavigation('e-Prescribing');
        },

        // Create a new patient entry
        newPatient: function () {
            this.activeView.close();
            this.activeView = new PatientAddView({ el: this.el, patientsCollection: this.patientsCollection });
            this.highlightNavigation('e-Prescribing');
        },

        // Remove a patient entry
        destroyPatient: function (patientId) {
            var self = this;

            this.patientsCollection.get(patientId).destroy({
                success: function () {
                    _.defer(function () {
                        self.activeView.flash('success', 'Patient removed successfully.');
                        window.app.navigate('patients', { trigger: true });
                    });
                },
                error: function () {
                    _.defer(function () {
                        self.activeView.flash('danger', 'There was a problem removing that patient. Please try again.');
                        window.app.navigate('patients', { trigger: true });
                    });
                }
            });
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
