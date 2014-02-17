/*global define */
/*global $ */
/**
 * Mediator module. Implements pub-sub pattern.
 * @module mediator
 * @todo: change event binding and unbinding
 */
define('modules/mediator', function () {
    'use strict';

    /**
     * Mediator class
     * @class Mediator
     */
    var Mediator = function(){
        var me = this;

        me.subscribers = {};
        me.lastId = 0;
    };

    /**
     * Attaches mediator interface to any given object
     * @function Mediator#subscribe
     * @param  {object} object object to attach the interface to
     * @return {void}
     */
    Mediator.prototype.subscribe = function(object){
        var me = this;

        object.mediator = me;
        object.fireEvent = object.trigger = me.publishProxy;
        object.addListener = object.on = me.listenProxy;
        object.removeListener = object.off = me.unListenProxy;
        object.one = me.oneListenProxy;
        object.handlersCache = {};
    };

    /**
     * Attaches event listener
     * @function Mediator#listen
     * @param  {string} eventName event name
     * @param  {function} handler   event handler
     * @param  {object} context   event handler context
     * @param  {boolean} single    if set to true handler will be removed after first use
     * @return {number}           event handler id
     */
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

    /**
     * Removes event handler
     * @function Mediator#unListen
     * @param  {string} eventName event name
     * @param  {number} handlerId handler id to be removed
     * @todo test it
     */
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

    /**
     * Publishes event across all listeners. Invokes attached event handlers.
     * @function Mediator#publish
     * @return {void}
     */
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

    /**
     * Generates handler id
     * @function Mediator#_generateId
     * @return {number} handler id
     * @private
     */
    Mediator.prototype._generateId = function(){
        return ++this.lastId;
    };

    /**
     * Delegates event firing to subscribed object
     * @function Mediator#publishProxy
     * @alias Mediator#fireEvent
     * @alias Mediator#trigger
     */
    Mediator.prototype.publishProxy = function(){
        var mediator = this.mediator;
        mediator.publish.apply(mediator, arguments);
    };

    /**
     * Delegates listener attaching to subscribed object
     * @function Mediator#listenProxy
     * @alias Mediator#addListener
     * @alias Mediator#on
     */
    Mediator.prototype.listenProxy = function(){
        var mediator = this.mediator;
        return mediator.listen.apply(mediator, arguments);
    };

    /**
     * Delegates single listener attaching to subscribed object
     * @function Mediator#oneListenProxy
     * @alias Mediator#one
     */
    Mediator.prototype.oneListenProxy = function(){
        var mediator = this.mediator;
        return mediator.listen.apply(mediator, [arguments[0], arguments[1], arguments[2], true]);
    };

    /**
     * Delegates listener detaching to subscribed object
     * @function Mediator#unListenProxy
     * @alias Mediator#off
     * @alias Mediator#removeListener
     */
    Mediator.prototype.unListenProxy = function(){
        var mediator = this.mediator;
        mediator.unListen.apply(mediator, arguments);
    };

    return Mediator;
});