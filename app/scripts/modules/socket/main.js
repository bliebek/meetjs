/*global define */
/*global SockJS */
/**
 * Socket module.
 * @module socket
 */
define('modules/socket', function () {
    'use strict';

    /**
     * Socket class
     * @class Socket
     */
    var Socket = function () {
        var me = this;

        //TODO: move this to config
        me.socketUrl = 'http://127.0.0.1:9999/echo';

        me.socket = null;
    };

    /**
     * Init method, invoked upon application start. Connects to socket
     * @function Socket#init
     * @public
     */
    Socket.prototype.init = function () {
        this.connect();
    };

    /**
     * Connecting to socket
     * @function Socket#connect
     * @public
     */
    Socket.prototype.connect = function () {
        var me = this;

        try {
            me._connect();
        } catch (e) {
            setTimeout(function () {
                me._connect();
            }, me._calculateConnectionTimeout());
        }
    };

    /**
     * Actoal connection method
     * @function Socket#_connect
     * @private
     */
    Socket.prototype._connect = function () {
        var me = this;

        if (me._canReconnect()) {
            try {
                me.socket = new SockJS(me.socketUrl, {debug: true});
                me.addSocketEvents();
            } catch (e) {
                console.log('E:', e);
            }
        }
    };

    /**
     * Adding events to open socket
     * @function Socket#addSocketEvents
     * @public
     */
    Socket.prototype.addSocketEvents = function () {
        var me = this,
            socket = me.socket;

        socket.onopen = me._onSocketOpen;
        socket.onclose = me._onsSocketClose;
        socket.onerror = me._onSocketError;
        socket.onmessage = me._onSocketMessage;

    };

    /**
     * Triggered when socket closes
     * @function Socket#_onSocketClose
     * @private
     * @todo test this
     */
    Socket.prototype._onSocketClose = function () {
        console.log('socket close', arguments);
    };

    /**
     * Triggered when socket opens
     * @function Socket#_onSocketOpen
     * @private
     */
    Socket.prototype._onSocketOpen = function () {
        console.log('socket open', arguments);
    };

    /**
     * Triggered when socket error occurs
     * @function Socket#_onSocketError
     * @private
     */
    Socket.prototype._onSocketError = function () {
        console.log('socket error', arguments);
    };

    /**
     * Triggered when a message is received through socket
     * @function Socket#_onSocketMessage
     * @param {object} msg message object
     * @fires socketMessage
     * @private
     */
    Socket.prototype._onSocketMessage = function(msg){
        console.log('socket message', arguments);
        this.fireEvent('socketMessage', msg);
    };

    /**
     * Calulates time of socket reconnection
     * @function Socket#_calculateConnectionTimeout
     * @return {number} reconnection time in ms
     * @private
     */
    Socket.prototype._calculateConnectionTimeout = function () {
        return 3000;
    };

    /**
     * Allows to reconnect
     * @function Socket#_canReconnect
     * @return {boolean} if true, socket can reconnect
     * @private
     */
    Socket.prototype._canReconnect = function () {
        return true;
    };

    return new Socket();
});