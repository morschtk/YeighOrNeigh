var appChat = angular.module("appChat", ['ngStorage']);

appChat.controller('chatController', function($scope, currentUserService, $localStorage, matchedUserService, messageService, socket) {
	$scope.currName = currentUserService.getName;

	messageService.query({id: matchedUserService.getMatchId()}, function(data){
    $scope.messages = data;
		socket.emit('addUser', {
			username: $scope.currName(),
			matchId: matchedUserService.getMatchId()
		});
	});

	$scope.messages = [];

	$scope.sendMessage = function () {
    $scope.messageObj = {
      created_by: $localStorage.currUser,
      created_at: Date.now(),
      message: $scope.message
    };
    messageService.save({id: matchedUserService.getMatchId()}, $scope.messageObj);
	  socket.emit('sendMessage', {
			displayName: $scope.currName(),
			picture: currentUserService.getPics()[0].path,
			createdBy: $localStorage.currUser,
			createdAt: Date.now(),
	    message: $scope.message
	  });

	  // clear message box
	  $scope.message = '';
	};

	socket.on('sendMessage', function (message) {
	  $scope.messages.push(message);
	});
});
