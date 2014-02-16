/*global require */
require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery'
    },
    packages: [
        'modules/mediator',
        'modules/main'
    ]
});

require([
    'app',
    'modules/mediator',
    'modules/main'
], function (Application, Mediator) {
    'use strict';

    var app = new Application(Mediator);

    app.registerModules(Array.prototype.slice.call(arguments, 2));

    app.init();
});