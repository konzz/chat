angular.module('chat')
.factory('connection', function(){
    return io(document.domain+':8080');
})