'use strict';
var socketio = require('socket.io');
var express = require('express');

var app = express();
var io = socketio.listen(app.listen(8080));

io.sockets.on('connection', require('./chat.js'));

app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

app.use('/', express.static(__dirname + '/client'));

console.log('Chat server listening to http://localhost:8080');