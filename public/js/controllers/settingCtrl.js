var appSettings = angular.module("appSettings", ['ngMaterial', 'ngStorage']);

appSettings.controller('settingController', function($scope, $timeout, $http, $location, potentialService, settingService, currentUserService, $localStorage) {

	$scope.currUser = {};
	var roundDist = currentUserService.getDesDist() * 0.00062137;
	var numDist = roundDist.toString().indexOf('.');
	if(numDist >= 0){
		roundDist = roundDist.toString().split(".");
		if(roundDist[1][0] >= 5){
			$scope.currUser.maxDistance = Math.abs(roundDist[0]) + 1;
		}else{
			$scope.currUser.maxDistance = roundDist[0];
		}
	}else{
		$scope.currUser.maxDistance = roundDist;
	}
	
	if(currentUserService.getDesGender().length == 2){
		$scope.currUser.desGender = 'both';
	} else{
		$scope.currUser.desGender = currentUserService.getDesGender()[0];
	}
	$scope.currUser.minAge = currentUserService.getMinAge();
	$scope.currUser.maxAge = currentUserService.getMaxAge();
	$scope.range = $scope.currUser.minAge + ' - ' + $scope.currUser.maxAge;

	$scope.changeAge = function(id, num){
		if($scope.currUser.minAge > ($scope.currUser.maxAge-4)){
			switch(id){
				case 'min':
					$scope.currUser.minAge = $scope.currUser.maxAge - 4;
					break;
				case 'max':
					$scope.currUser.maxAge = $scope.currUser.minAge + 4;
					break;
				default:
					alert("Your Min age can not be larger then your max age.");
			}
		}
		$scope.range = $scope.currUser.minAge + ' - ' + $scope.currUser.maxAge;
	};

	$scope.saveSettings = function(){
		$scope.currUser.maxDistance = ($scope.currUser.maxDistance / 0.00062137);
		settingService.update({id: $localStorage.currUser}, $scope.currUser);
		currentUserService.goSettings(false);
	};

});