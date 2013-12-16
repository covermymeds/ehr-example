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
    'views/requests/list',
    'views/requests/add',
    'collections/patients',
    'text!templates/navigation.html'
], function ($, Bootstrap, _, Backbone, DefaultView, PatientListView, PatientAddView, RequestListView, RequestAddView, PatientsCollection, navigationTemplate) {
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

            this.elem = $(navigationTemplate);
            this.render();

            el = $('#page-load-target');

            this.patientsCollection = new PatientsCollection();

            this.scenes = {};
            this.scenes.index = new DefaultView({ el: el });
            this.scenes.patientList = new PatientListView({ el: el, 'patientsCollection': this.patientsCollection });
            this.scenes.patientAdd = new PatientAddView({ el: el, 'patientsCollection': this.patientsCollection });
            // this.scenes.patientShow = new PatientShowView({ el: el });
            this.scenes.requestList = new RequestListView({ el: el });
            this.scenes.requestAdd = new RequestAddView({ el: el });

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
            var key;

            this.activeScene.hide();

            if (this.scenes[scene] !== undefined) {
                this.activeScene = this.scenes[scene];

                // Transfer passed options parameters
                if (options !== undefined) {
                    for (key in options) {
                        if (options.hasOwnProperty(key)) {
                            this.activeScene[key] = options[key];
                        }
                    }
                }
            }

            this.activeScene.show();
        }
    });

    app = new AppController({ el: $('#app') });
});
