var appAuth = angular.module("appAuth", ['ngMaterial']);

appAuth.controller('authController', function($scope, $http, $location, currentUserService){

	$scope.regHorse = {username: '', password: '', lat: '', lon: ''};
	$scope.logHorse = {username: '', password: '', lat: '', lon: ''};
	$scope.userAuthenticated = currentUserService.getAuth;

	$scope.register = function(){
	  	$scope.regHorse.lat = myLat;
	  	$scope.regHorse.lon = myLon;
	  	$http.post('/signup', $scope.regHorse).success(function(data){
			if(data.state == 'success'){
				currentUserService.setAuth(true);
				$scope.userAuthenticated = currentUserService.getAuth;
				currentUserService.setUser(data.user.username);
				$scope.scope_current_user = data.user.username;
				$scope.regHorse = {username: '', password: '', lat: '', lon: ''};
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
			}
		}).error(function(data, status){
			$scope.error_message = "Please register with a different username.";
		});
  	};

  	$scope.logIn = function(){
	  	$scope.logHorse.lat = myLat;
	  	$scope.logHorse.lon = myLon;
	  	$http.post('/login', $scope.logHorse).success(function(data){
			if(data.state == 'success'){
				currentUserService.setAuth(true);
				$scope.userAuthenticated = currentUserService.getAuth;
				currentUserService.setUser(data.user.username);
				$scope.scope_current_user = data.user.username;
				$scope.logHorse = {username: '', password: '', lat: '', lon: ''};
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
			}
		}).error(function(data, status){
			$scope.error_message = "Please check your username and password.";
		});
  	};

	$scope.checkLocation = function(){ 
		//check for geolocation support
		if (navigator.geolocation) {

			navigator.geolocation.getCurrentPosition(function(position){
				startPos = position;
				//radius = 10;

				myLat = startPos.coords.latitude;
				myLon = startPos.coords.longitude;

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
	}	

	$scope.signout = function(){
		$http.get('/signout');
		currentUserService.setAuth(false);
		// $scope.userAuthenticated = false;
		currentUserService.setUser("");
		$scope.scope_current_user = "";
		$scope.error_message = "";
		$location.path('/register');
	};

	// This checks for whether the user has a current session or not
	// If is finds one automatically logs in else hits splash page
	$scope.checkSession = function(){
		$http.get('/success').success(function(data){
			if(data.state == 'success' && data.user){
				currentUserService.setAuth(true);
				$scope.userAuthenticated = currentUserService.getAuth;
				$scope.scope_current_user = data.user.username;
				currentUserService.setUser($scope.scope_current_user);
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
				$location.path('/register');
			}
		});
	};

	$scope.checkSession();

	$scope.checkLocation();

});