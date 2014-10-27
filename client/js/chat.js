'use strict';

angular.module('chat', [])
.controller('chat', function($scope, server, $anchorScroll, $location){

    $scope.connected = false;
    $scope.messages = [];
    $scope.users = [];
    $location.hash('bottom');

    $scope.connect = function(){
        server.emit('connection_request', $scope.nickname);
    };

    $scope.send_message = function(){
        server.emit('message', $scope.message);
        $scope.message = '';
    };

    server.on('message', function(nickname, message){
        $scope.messages.push({nickname: nickname, message: message});
        $anchorScroll();
        $scope.$digest();
    });

    server.on('connection_accepted', function(users){
        $scope.users = users;
        $scope.connected = true;
        $scope.$digest();
    });

    server.on('user_connected', function(nickname){
        $scope.users.push(nickname);
        $scope.messages.push({nickname: 'system', message: nickname + ' connected'});
        $scope.$digest();
    });

    server.on('disconnect', function(nickname){
        $scope.users.splice($scope.users.indexOf(nickname), 1);
        $scope.messages.push({nickname: 'system', message: nickname + ' disconnected'});
        $scope.$digest();
    });
});