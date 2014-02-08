/*global SockJS*/
'use strict';

var socket = new SockJS('http://127.0.0.1:9999/echo', {debug: true});

socket.onopen = function(){
	console.log('Socket open', arguments);
};
socket.onmessage = function(){
	console.log('Socket message', arguments);
};
socket.onclose = function(){
	console.log('Socket close', arguments);
};
socket.onerror = function(){
	console.log('Socket error', arguments);
};

$('.navigate-left').click(function(){
	socket.send('goLeft');
});

$('.navigate-right').click(function(){
	socket.send('goRight');
});