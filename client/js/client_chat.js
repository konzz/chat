'use strict';
var server = io(document.domain+':8080');

$('document').ready(function(){

	var add_user_to_list = function(nickname){
		$('#users').append('<li id="'+nickname+'">'+nickname+'</li>');
	};

    var add_chat_message = function(nickname, message){
        $('#messages').append('<li><span class="user">'+nickname+': </span><span>'+message+'</span></li>');
    };

	var nickname = window.prompt('nickname?');
	
	if(nickname){
		server.emit('join', nickname);
        add_user_to_list(nickname);
	}

    server.on('connection_accepted', function(users){
        users.forEach(add_user_to_list);
    });

	server.on('join', add_user_to_list);

	$('#chat_input').submit(function(e){
		e.preventDefault();
		var message = $('#text_input').val();
		$('#text_input').val('');

		server.emit('chat_message', message);
        add_chat_message(nickname, message);
	});

    server.on('chat_message', add_chat_message);

    server.on('disconnect', function(nickname){
        console.log(nickname + ' disconnected...');
        $('#'+nickname).remove();
    });
});

window.onbeforeunload = function(){
    server.disconnect();
};
