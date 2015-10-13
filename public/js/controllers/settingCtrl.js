var appSettings = angular.module("appSettings", ['ngMaterial', 'ngStorage']);

appSettings.controller('settingController', function($scope, $timeout, $http, $location, potentialService, dislikeService, likeService, currentUserService, $localStorage) {

	$scope.currUser = {};
	$scope.currUser.maxDistance = 12;


});