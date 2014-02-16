/*global define */
/*global SockJS */

define('modules/socket', function () {
    'use strict';

    var Socket = function () {
        var me = this;

        //TODO: move this to config
        me.socketUrl = 'http://127.0.0.1:9999/echo';

        me.socket = null;
    };

    Socket.prototype.init = function () {
        this.connect();
    };

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

    Socket.prototype.addSocketEvents = function () {
        var me = this,
            socket = me.socket;

        socket.onopen = me._onSocketOpen;
        socket.onclose = me._onsSocketClose;
        socket.onerror = me._onSocketError;
        socket.onmessage = me._onSocketMessage;

    };
    //TODO: test this
    Socket.prototype._onSocketClose = function () {
        console.log('socket close', arguments);
    };

    Socket.prototype._onSocketOpen = function () {
        console.log('socket open', arguments);
    };

    Socket.prototype._onSocketError = function () {
        console.log('socket error', arguments);
    };

    Socket.prototype._onSocketMessage = function(msg){
        console.log('socket message', arguments);
        this.fireEvent('socketMessage', msg);
    };

    Socket.prototype._calculateConnectionTimeout = function () {
        return 3000;
    };

    Socket.prototype._canReconnect = function () {
        return true;
    };

    return new Socket();
});