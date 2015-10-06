var appLoad = angular.module("appLoad", ['ngMaterial', 'ngStorage']);

appLoad.controller('loadController', function($scope, $http, $location, $localStorage, horseService, currentUserService, $timeout){
	$scope.check = false;

	//FindandModify the current user update their current location and pull back data to then query for potential matches
	//And to remove lat and lon from auth ctrl



	//update lat and lon when log in
	$scope.checkLocation = function(){ 
		//check for geolocation support
		if (navigator.geolocation) {
			console.log("in load ctrl");

			navigator.geolocation.getCurrentPosition(function(position){
				startPos = position;
				//radius = 10;

				$scope.myLat = startPos.coords.latitude;
				$scope.myLon = startPos.coords.longitude;

				currentUserService.setLon($scope.myLon);
				currentUserService.setLat($scope.myLat);

				// $localStorage.currLon = $scope.myLon;
				// $localStorage.currLat = $scope.myLat;

				// console.log("local storage " + $localStorage.currLat);
				// console.log("local storage " + $localStorage.currLon);

				console.log("Service storage " + currentUserService.getLon());
				console.log("Service storage " + currentUserService.getLat());

				currentUserService.setCheck(true);
				
				$scope.goHome();
				// getLatLng();

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
		console.log($scope.theCoords);

		$http.put('/api/currHorse', $scope.theCoords).success(function(currHorse, status){
			console.log(currHorse.dislikes);
			
			currentUserService.setLikes(currHorse.likes);
			currentUserService.setDislikes(currHorse.dislikes);
			currentUserService.setLikedBy(currHorse.likedBy);

			$timeout(function(){
		  		console.log("has been checked!");
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
		console.log($localStorage.currUser);
		$scope.scope_current_user = "";
		$scope.error_message = "";
		$location.path('/register');
	};

	if($localStorage.currUser !== undefined){
		$scope.checkLocation();
	}else{
		$location.path('/register');
	};
	
});