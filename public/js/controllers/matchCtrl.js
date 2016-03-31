var appMatch = angular.module("appMatch", ['ngStorage']);

appMatch.controller('matchController', function($scope, $location, currentUserService, $localStorage, matchesService, matchedUserService) {
	$scope.currName = currentUserService.getName;

	matchesService.get({id: $localStorage.currUser}, function(data){
		$scope.people = data.matched;
	});

	$scope.goToPerson = function(user, ev){
		matchedUserService.setMatchId(user._match._id);
		$location.path('/chat');
	};
});
