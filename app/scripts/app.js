/*global define */
define('app', [], function () {
    'use strict';

    var Application = function(Mediator){
        var me = this,
            mediator = new Mediator();

        me.modules = [];
        mediator.subscribe(me);
    };

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

    Application.prototype.registerModules = function(modules){
        console.log('modules: ', modules);
        var me = this,
            i = 0,
            len = modules.length;

        for(i; i < len; i++){
            me.registerModule(modules[i]);
        }

        return me;
    };

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

    Application.prototype.init = function(){
        this.fireEvent('applicationReady');
    };

    return Application;
});