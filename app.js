'use strict';
var socketio = require('socket.io');
var express = require('express');
var _ = require('underscore');

var app = express();
var io = socketio.listen(app.listen(8080));

var users = [];


io.sockets.on('connection', function(connection){
  console.log('user connected...');
  var nickname;

  connection.on('connection_request', function(_nickname){
    nickname = _nickname;
    users.push(nickname);

    connection.emit('connection_accepted', users);

    connection.broadcast.emit('user_connected', nickname);
    console.log('user joined with nickname', nickname);
  });

  connection.on('disconnect', function(){
    console.log(nickname + ' disconnected...');
    if(nickname){
      io.emit('user_disconnected', nickname);
      users = _(users).without(nickname);
    }
  });

  connection.on('message', function(message){
    console.log( nickname + ' says ' + message);
    io.emit('message', nickname, message);
  });

});

app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

app.use('/', express.static(__dirname + '/client'));

console.log('Chat server listening to http://localhost:8080');