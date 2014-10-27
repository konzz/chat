angular.module('chat')
.factory('server', function(){
    return io(document.domain+':8080');
})