'use strict';

var http = require('http'),
    sockjs = require('sockjs'),
    socket = sockjs.createServer(),
    connections = [];

var node_static = require('node-static');

socket.on('connection', function(conn) {
    console.log('Got connection');
    connections.push(conn);
    conn.on('data', function(message) {
        console.log('Got data: ' + message);
        for (var i=0; i<connections.length; i++) {
            connections[i].write(message);
        }
    });
    conn.on('close', function() {
        connections.splice(connections.indexOf(conn), 1);
        console.log('Lost connection');
    });
});

var static_directory = new node_static.Server(__dirname);

var server = http.createServer();

server.addListener('request', function(req, res) {
    static_directory.serve(req, res);
});
server.addListener('upgrade', function(req,res){
    res.end();
});

socket.installHandlers(server, {prefix:'/echo'});
console.log(' [*] Listening on 0.0.0.0:9999' );
server.listen(9999, '0.0.0.0');