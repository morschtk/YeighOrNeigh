
var appSettings = angular.module("appSettings", ['ngMaterial', 'ngStorage', 'ngFileUpload']);

appSettings.controller('settingController',[ '$scope', 'Upload', '$timeout', '$http', '$location', 'potentialService', 'settingService', 'currentUserService', '$localStorage', function($scope, Upload, $timeout, $http, $location, potentialService, settingService, currentUserService, $localStorage) {

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

	$scope.horse = {};
	$scope.horse.bio = currentUserService.getBio();
	$scope.horse.name = currentUserService.getName();
	$scope.horse.age = currentUserService.getAge();
	$scope.horse.distance = currentUserService.getMiles();
	$scope.horse.lastSeen = currentUserService.getTimeAway();
	$scope.photosArr = currentUserService.getPics();
	$scope.dspPhotos = [];
	for(var i=0; i<6; i++){
		if($scope.photosArr[i] == undefined){
			$scope.dspPhotos[i] = 'images/add_user.png';
		}else{
			$scope.dspPhotos[i] = $scope.photosArr[i];
		}
	}
	
	$scope.hideUplaod = false;
	console.log($scope.photosArr);
	console.log($scope.dspPhotos);

	$scope.alterImage = function(imgNum, path){
		console.log(imgNum);
		console.log(path);
		$timeout(function() {
		  document.getElementById(imgNum).click();

		}, 100);
	};

console.log($localStorage.currUser);
	$scope.upload = function(afile, pos) { 
		$scope.pos = pos;
        Upload.upload({
          url: '/api/images',
          data: {
          	file: afile,
            'theUser': $localStorage.currUser,
            'pos': $scope.pos
          }
        }).then(function (resp) {
        console.log('Success ' + resp.config.data.file.name + ' uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });	      
    };

	$scope.changeAge = function(id, num){
		console.log($scope.currUser.minAge);
		console.log($scope.currUser.maxAge-4);
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
		currentUserService.goSettings('home');
	};

}]);