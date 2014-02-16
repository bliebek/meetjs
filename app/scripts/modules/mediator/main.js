/*global define */
//TODO: change event unbinding
define('modules/mediator', ['jquery'], function ($) {
    'use strict';

    var Mediator = function(){
        var me = this;

        me.subscribers = {};
        me.lastId = 0;
    };

    Mediator.prototype.subscribe = function(object){
        var me = this;

        object.mediator = me;
        object.fireEvent = object.trigger = me.publishProxy;
        object.addListener = object.on = me.listenProxy;
        object.removeListener = object.off = me.unListenProxy;
        object.one = me.oneListenProxy;
        object.handlersCache = {};
    };

    Mediator.prototype.listen = function(eventName, handler, context, single){
        var me = this,
            id = me._generateId();

        if(typeof me.subscribers[eventName] === 'undefined'){
            me.subscribers[eventName] = [];
        }

        me.subscribers[eventName].push({
            id: id,
            handler: handler,
            context: context,
            single: single
        });

        return id;
    };

    //TODO: needs testing
    Mediator.prototype.unListen = function(eventName, handlerId){
        var me = this,
            index = -1,
            handlersList = me.subscribers[eventName];

        if(typeof handlersList === 'object' && handlersList.length){
            $.each(handlersList, function(key, row){
                if(row.id === handlerId){
                    index = key;
                    return false;
                }
            });
            if(index > -1){
                me.subscribers[eventName].splice(index, 1);
            }
        }
    };

    //TODO: profile this
    Mediator.prototype.publish = function(){
        var me = this,
            eventName = arguments[0],
            eventParams = Array.prototype.slice.call(arguments, 1),
            i,
            len,
            handlers = me.subscribers[eventName],
            handlerObject;

        if(typeof handlers === 'undefined'){
            handlers = me.subscribers[eventName] = [];
        }

        for(i = 0, len = handlers.length; i < len; i++){
            handlerObject = handlers[i];
            if(typeof handlerObject.handler === 'function'){
                handlerObject.handler.apply(handlerObject.context || this, eventParams);
            }
            if(handlerObject.single === true){
                me.unListen(eventName, handlerObject.id);
            }
        }
    };

    Mediator.prototype._generateId = function(){
        return ++this.lastId;
    };

    Mediator.prototype.publishProxy = function(){
        var mediator = this.mediator;
        mediator.publish.apply(mediator, arguments);
    };

    Mediator.prototype.listenProxy = function(){
        var mediator = this.mediator;
        return mediator.listen.apply(mediator, arguments);
    };

    Mediator.prototype.oneListenProxy = function(){
        var mediator = this.mediator;
        return mediator.listen.apply(mediator, [arguments[0], arguments[1], arguments[2], true]);
    };

    Mediator.prototype.unListenProxy = function(){
        var mediator = this.mediator;
        mediator.unListen.apply(mediator, arguments);
    };

    return Mediator;
});