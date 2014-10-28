'use strict';

angular.module('chat', [])
.controller('chat', function($scope, connection, $anchorScroll, $location){

  $scope.connected = false;
  $scope.messages = [];
  $scope.users = [];
  $location.hash('bottom');

  $scope.connect = function(){
    connection.emit('connection_request', $scope.nickname);
  };

  $scope.send_message = function(){
    connection.emit('message', $scope.message);
    $scope.message = '';
  };

  connection.on('message', function(nickname, message){
    $scope.messages.push({nickname: nickname, message: message});
    $anchorScroll();
    $scope.$digest();
  });

  connection.on('connection_accepted', function(users){
    $scope.users = users;
    $scope.connected = true;
    $scope.$digest();
  });

  connection.on('user_connected', function(nickname){
    $scope.users.push(nickname);
    $scope.messages.push({nickname: 'system', message: nickname + ' connected'});
    $scope.$digest();
  });

  connection.on('user_disconnected', function(nickname){
    $scope.users.splice($scope.users.indexOf(nickname), 1);
    $scope.messages.push({nickname: 'system', message: nickname + ' disconnected'});
    $scope.$digest();
  });

  connection.on('disconnect', function(){
    $scope.connected = false;
    $scope.messages = [];
    $scope.users = [];
    $scope.$digest();
  });
});