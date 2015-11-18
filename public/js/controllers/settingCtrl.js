
var appSettings = angular.module("appSettings", ['ngMaterial', 'ngStorage', 'ngFileUpload'], function($compileProvider){
	
	$compileProvider.directive('compile', function($compile, currentUserService, $location) {
      // directive factory creates a link function
      return function(scope, element, attrs) {
        scope.$watch(
          function(scope) {
             // watch the $scope.dspPhotos array for changes
            return scope.dspPhotos;
          },
          function(value) {
          	for(var i = 0; i < element[0].children.length; i++){
          		for(var n = 0; n < element[0].children[i].children.length; n++){
	          		if(element[0].children[i].children[n].children[0].src.includes('add_user.png')){
	          			var div = element[0].children[i].children[n];
	          			div.removeAttribute("ng-click");
	          			div.removeAttribute("ngf-select");
	          			var place = div.id.slice(-1);
	          			var att = document.createAttribute('ngf-select');
	          			att.value = "upload($file, '" + last + "')";
	        			div.setAttributeNode(att);
	          		}else{
	          			var div = element[0].children[i].children[n];
	          			div.removeAttribute("ngf-select");
	          			div.removeAttribute("ng-click");
	          			var place = div.id.slice (-1);
	          			var last = Math.abs(place)+1;
	          			var att = document.createAttribute('ng-click');
	          			att.value = "unlink('" + place + "', dspPhotos[" + place + "], $event)";
	        			div.setAttributeNode(att);
	          		}
	          	}
          	}

            // compile the new DOM and link it to the current scope.
            // NOTE: we only compile .childNodes so that
            // we don't get into infinite loop compiling ourselves
            
            $compile(element.contents())(scope);
          }
        );
      };
    });
});



appSettings.controller('settingController',[ '$scope', '$mdDialog', 'Upload', '$timeout', '$http', '$location', '$route', 'potentialService', 'settingService', 'currentUserService', '$localStorage', function($scope, $mdDialog, Upload, $timeout, $http, $location, $route, potentialService, settingService, currentUserService, $localStorage) {

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

	$scope.generateImages = function(){
		$scope.photosArr = currentUserService.getPics();
		$scope.dspPhotos = [];
		var tempArr = [];
		for(var i=0; i<6; i++){
			if($scope.photosArr[i] == undefined){
				tempArr[i] = 'images/add_user.png';

			}else{
				tempArr[i] = $scope.photosArr[i].path;
			}
		}
		$scope.dspPhotos = tempArr;
	};
	$scope.generateImages();

	$scope.unlink = function(pos, oldPath, ev){
		$scope.pos = pos;
		$scope.oldPath = oldPath;

		var confirm = $mdDialog.confirm()
        	.title('Are you sure you want to delete this picture?')
        	.ariaLabel('Delete picture')
        	.targetEvent(ev)
        	.ok('Please do it!')
        	.cancel('No I fat fingered it..');

	    $mdDialog.show(confirm).then(function() {
	      // If the user wants to delete the picture run this code..
	      if($scope.oldPath !== 'images/add_user.png'){
	      	var delData = {
	      		user: $localStorage.currUser,
	      		path: oldPath,
	      		pos: $scope.pos
	      	};
	      	$http.put('/api/images', delData).success(function(data,status){
	      		currentUserService.setPics(data);
	      		$scope.generateImages();
	      		$route.reload();
	      	});
	      }
	    }, function() {
	      // If the user doesn't want to delete the picture run this code..
	      console.log("Did Nothing");
	    });	
	};

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
        	console.log('Success ' + resp.config.data.file.name);
        	console.log(resp.data);
        	currentUserService.setPics(resp.data);
			$scope.generateImages();
        	$route.reload();
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });	      
    };

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
		currentUserService.goSettings('home');
	};

}]);