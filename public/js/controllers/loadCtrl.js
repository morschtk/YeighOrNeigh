var appLoad = angular.module("appLoad", ['ngMaterial', 'ngStorage']);

appLoad.controller('loadController', function($scope, $http, $location, $localStorage, horseService, currentUserService, $timeout){
	$scope.check = false;

	//FindandModify the current user update their current location and pull back data to then query for potential matches
	//And to remove lat and lon from auth ctrl

	//update lat and lon when log in
	$scope.checkLocation = function(){ 
		//check for geolocation support
		if (navigator.geolocation) {

			navigator.geolocation.getCurrentPosition(function(position){
				startPos = position;
				//radius = 10;

				$scope.myLat = startPos.coords.latitude;
				$scope.myLon = startPos.coords.longitude;

				currentUserService.setLon($scope.myLon);
				currentUserService.setLat($scope.myLat);

				currentUserService.setCheck(true);
				
				$scope.goHome();

			}, function(error){
				alert("Error occurred. Error.code: " + error.code);
			//	error.code can be:
		    //	  0: unknown error
		    //	  1: permission denied
		    //	  2: position unavailable (error response from locaton provider)
		    //	  3: timed out
			});
		} else{
			console.log('geolocation is not supported for this Browser/OS version yet.');
		}
	};

	$scope.goHome = function(){
		$scope.theCoords = {
			id: $localStorage.currUser,
			lon: $scope.myLon, 
			lat: $scope.myLat
		};

		var today = new Date();
		$scope.card = true;
		$scope.details = false;	

		$scope.getAge = function(dateString) {
		  var birthDate = new Date(dateString);
		  var age = today.getFullYear() - birthDate.getFullYear();
		  var m = today.getMonth() - birthDate.getMonth();
		  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		      age--;
		  }
		  return age;
		}

		//Gets the current users data to prepare for the potential matches 
		$http.put('/api/currHorse', $scope.theCoords).success(function(currHorse, status){
			currentUserService.setLikes(currHorse.likes);
			currentUserService.setDislikes(currHorse.dislikes);
			currentUserService.setLikedBy(currHorse.likedBy);

			currentUserService.setDesDist(currHorse.settings.desired_distance);
			currentUserService.setMinAge(currHorse.settings.desired_age_min);
			currentUserService.setMaxAge(currHorse.settings.desired_age_max);

			currentUserService.setBio(currHorse.bio);
			
			currentUserService.setPics(currHorse.pictures);
			currentUserService.setName(currHorse.username);
			currentUserService.setAge($scope.getAge(currHorse.birthday));
	  		currentUserService.setMiles(currHorse.miles_away);



			var aDate = new Date(currHorse.last_logged);
			var seconds = (today.getTime() - aDate.getTime())/1000;
			var timeElapsed = seconds/60;
			var units = ". minutes";
			if(timeElapsed > 60){
				timeElapsed = timeElapsed/60;
				units = ". hours";

				if(timeElapsed > 24){
					timeElapsed = timeElapsed/24;
					units = ". days";
				}
			}
			timeElapsed = timeElapsed + units;
			var numToRound = timeElapsed.split(".");
			timeElapsed = numToRound[0] + numToRound[2];
			currentUserService.setTimeAway(timeElapsed);


			
			if(currHorse.settings.desired_gender == 'both'){
				$scope.desGenderArr = ['male', 'female'];
			}else{
				$scope.desGenderArr = [currHorse.settings.desired_gender];
			}
			currentUserService.setDesGender($scope.desGenderArr);

			$timeout(function(){
		  		$location.path('/home');
			}, 750);
		});
	};



	$scope.signout = function(){
		$http.get('/signout');
		currentUserService.setAuth(false);
		// $scope.userAuthenticated = false;
		// currentUserService.setUser("");
		delete $localStorage.currUser;
		$scope.scope_current_user = "";
		$scope.error_message = "";
		$location.path('/register');
	};

	if($localStorage.currUser !== undefined){
		$scope.checkLocation();
	}else{
		currentUserService.setAuth(false);
		$location.path('/register');
	};
	
});