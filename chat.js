var _ = require('underscore');

var users = [];

var chat = function(connection){
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
      connection.broadcast.emit('user_disconnected', nickname);
      users = _(users).without(nickname);
    }
  });

  connection.on('message', function(message){
    console.log( nickname + ' says ' + message);
    io.emit('message', nickname, message);
  });

}

module.exports = chat;