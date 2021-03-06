/*global define */
/**
 * Main application module
 * @module application
 */
define('app', [], function () {
    'use strict';

    /**
     * Main application class
     * @class Application
     * @param {object} Mediator mediator object
     */
    var Application = function(Mediator){
        var me = this,
            mediator = new Mediator();

        me.modules = [];
        mediator.subscribe(me);
    };

    /**
     * Registers module within the app
     * @function Application#registerModule
     * @param  {mixed} Module       module object or constructor
     * @param  {object} parentModule parent module object
     */
    Application.prototype.registerModule = function(Module, parentModule){
        var me = this,
            module;

        if(Module === null){
            return;
        }

        switch (typeof Module){
        case 'function':
            module = new Module();
            break;
        case 'object':
            module = Module;
            break;
        default:
            console.log(Module, 'is not an object');
            return false;
        }

        me._addModule(module, parentModule);

        if(typeof module._submodule !== 'undefined'){
            me.registerModule(module._submodule, module);
        }
    };

    /**
     * Handy wrapper to registerModule method
     * @function Application#registerModules
     * @param  {array} modules modules list
     * @return {object} application object
     */
    Application.prototype.registerModules = function(modules){
        var me = this,
            i = 0,
            len = modules.length;

        for(i; i < len; i++){
            me.registerModule(modules[i]);
        }

        return me;
    };

    /**
     * Adds module to internal modules list, attaches it to mediator and calls module::init() to invoke it.
     * @function Application#_addModule
     * @param {object} moduleObject module object
     * @param {object} parentModule linked parent module
     * @return {object} application object
     * @private
     */
    Application.prototype._addModule = function(moduleObject, parentModule){
        var me = this;

        me.mediator.subscribe(moduleObject);
        me.modules.push(moduleObject);

        //optional - recommend to disable it
        if(typeof parentModule !== 'undefined'){
            moduleObject._parent = parentModule;
            //to ensure parent module holds instance of
            //submodule object, not only it's constructor
            parentModule._submodule = moduleObject;
        }

        if(typeof moduleObject.init === 'function'){
            moduleObject.init();
        }

        return me;
    };

    /**
     * Starts the app
     * @function Application#init
     * @fires applicationReady
     */
    Application.prototype.init = function(){
        this.fireEvent('applicationReady');
    };

    return Application;
});