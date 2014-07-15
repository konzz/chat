'use strict';
var socketio = require('socket.io');
var express = require('express');
var _ = require('underscore');

var app = express();
var io = socketio.listen(app.listen(8080));

var users = [];

io.sockets.on('connection', function(client){
    console.log('Client connected...');
    var nickname;

    client.on('connection_request', function(_nickname){
        nickname = _nickname;
        users.push(nickname);
        
        client.emit('connection_accepted', users);
        
        client.broadcast.emit('user_connected', nickname);
        console.log('client joined with nickname', nickname);
    });

    client.on('disconnect', function(){
        console.log(nickname + ' disconnected...');
        if(nickname){
            io.emit('disconnect', nickname);
            users = _(users).without(nickname);
        }
    });

    client.on('message', function(message){
        console.log( nickname + ' says ' + message);
        io.emit('message', nickname, message);
    });

});

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});

app.use('/', express.static(__dirname + '/client'));

console.log('Chat server listening to http://localhost:8080');