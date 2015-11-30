var appMatch = angular.module("appMatch", ['ngMaterial', 'ngStorage']);

appMatch.controller('matchController', function($scope, $mdDialog, $http, $location, currentUserService, $localStorage, matchesService) {

	$scope.currName = currentUserService.getName;
	matchesService.get({id: $localStorage.currUser}, function(data){
		$scope.people = data.matched;
	});



});