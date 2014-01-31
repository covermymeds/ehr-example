({
    appDir: '.',
    baseUrl: 'src',
    //Uncomment to turn off uglify minification.
    //optimize: 'none',
    dir: 'build',
    mainConfigFile: 'src/main.js',
    //Stub out the text module after a build since it will not be needed.
    stubModules: ['text'],
    paths: {
        jquery: '../lib/jquery-1.10.2.min',
        underscore: '../lib/underscore-1.5.2.min',
        backbone: '../lib/backbone-1.1.0.min',
        bootstrap: '../lib/bootstrap-3.0.0.min',
        localstorage: '../lib/backbone.localStorage-1.1.7.min',
        cmmplugins: '../lib/js-api-consumer',
        cmmconfig: '../lib/config',
        select2: '../lib/select2.min',
        datatables: '../lib/jquery.dataTables.min',
        datatablesbootstrap: '../lib/datatables.bootstrap',
        bootstrapDatepicker: '../lib/bootstrap-datepicker'
    },
    modules: [
        {
            name: 'main'
        }
    ]
})