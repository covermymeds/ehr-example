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
    'views/requests/add',
    'views/requests/standaloneAdd',
    'collections/patients',
    'text!templates/navigation.html',
    'cmmplugins',
    'cmmconfig',
    'typeahead'
], function ($, Bootstrap, _, Backbone, DefaultView, PatientListView, PatientAddView, PatientShowView, RequestListView, RequestAddView, StandaloneAddView, PatientsCollection, navigationTemplate) {
    var app,
        AppController;

    // Extend Backbone
    Backbone.View.prototype.close = function () {
        if (typeof this.onClose === 'function') {
            this.onClose();
        }

        this.undelegateEvents();
        this.elem.remove();
    };

    Backbone.View.prototype.hide = function (duration, callback) {
        if (duration === undefined) {
            duration = 0;
        }

        this.undelegateEvents();
        this.elem.fadeOut(duration, callback);
    };

    Backbone.View.prototype.show = function (duration, callback) {
        if (duration === undefined) {
            duration = 0;
        }

        this.delegateEvents();
        this.elem.fadeIn(duration, callback);
    };

    Backbone.View.prototype.render = function () {
        this.$el.append(this.elem);
    };

    // App
    AppController = Backbone.View.extend({
        events: {
            'click .nav a': function (event) {
                var view = $(event.target).attr('href');

                event.preventDefault();
                this.changeScene(view);

                // Update navigation highlight state
                this.$('.nav li').removeClass('active');
                this.$(event.target).parents('li').addClass('active');
            }
        },

        initialize: function () {
            var el,
                key;

            _.bindAll(this, 'changeScene');

            this.elem = $(navigationTemplate);
            this.render();

            el = $('#page-load-target');

            this.patientsCollection = new PatientsCollection();
            this.patientsCollection.fetch();

            this.scenes = {};
            this.scenes.index = new DefaultView({ el: el });
            this.scenes.patientList = new PatientListView({ el: el, patientsCollection: this.patientsCollection });
            this.scenes.patientAdd = new PatientAddView({ el: el, patientsCollection: this.patientsCollection });
            this.scenes.patientShow = new PatientShowView({ el: el, patientsCollection: this.patientsCollection });

            this.scenes.requestList = new RequestListView({ el: el });
            this.scenes.requestAdd = new RequestAddView({ el: el });
            this.scenes.standaloneAdd = new StandaloneAddView({ el: el });

            for (key in this.scenes) {
                if (this.scenes.hasOwnProperty(key)) {
                    this.scenes[key].on('scene:change', this.changeScene);
                    this.scenes[key].hide();
                }
            }

            this.activeScene = this.scenes.index;
            this.activeScene.show();
        },

        changeScene: function (scene, options) {
            var key,
                reload;

            options = options || {};
            reload = options.reload
            delete options.reload;

            this.activeScene.hide();

            if (this.scenes[scene] !== undefined) {
                this.activeScene = this.scenes[scene];

                // Transfer passed options parameters
                for (key in options) {
                    if (options.hasOwnProperty(key)) {
                        this.activeScene[key] = options[key];
                    }
                }

                if (reload === true && typeof this.activeScene.reload === 'function') {
                    this.activeScene.reload();
                }
            }

            this.activeScene.show();
        }
    });

    app = new AppController({ el: $('#app') });
});
