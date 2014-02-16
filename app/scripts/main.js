/*global require */
require.config({
    packages: [
        'modules/mediator',
        'modules/main',
        'modules/socket'
    ]
});

require([
    'app',
    'modules/mediator',
    'modules/main',
    'modules/socket'
], function (Application, Mediator) {
    'use strict';

    var app = new Application(Mediator);

    app.registerModules(Array.prototype.slice.call(arguments, 2));

    app.init();
});