var appAuth = angular.module("appAuth", ['ngMaterial', 'ngStorage']);

appAuth.controller('authController', function($scope, $http, $location, currentUserService, $localStorage){

	$scope.regHorse = {username: '', password: '', lat: '', lon: '', birthday: '', gender: '', age: ''};
	$scope.logHorse = {username: '', password: '', lat: '', lon: ''};
	$scope.userAuthenticated = currentUserService.getAuth;
	var aDate = new Date();
	var aDate = aDate.getFullYear();
	var aYear;
	var yearArr = [];
	$scope.error_birthday = "";
	$scope.goSettings = currentUserService.goSettings;
	$scope.settingsCheck = currentUserService.getSettingsCheck;
	$scope.goEdit = currentUserService.goEdit;
	$scope.editCheck = currentUserService.getEditCheck;
	$scope.showLogInForm = true;

	$scope.matchPromise = currentUserService.getMatchesPromise;
	console.log($scope.matchPromise);

	$scope.changeForm = function(which){
		$scope.showLogInForm = which;
	};

	$scope.register = function(){
	  	$scope.regHorse.lat = $scope.myLat;
	  	$scope.regHorse.lon = $scope.myLon;

	  	var birth = $scope.regHorse.birthday
	  	 
	  	    var today = new Date();
	  	    var nowyear = today.getFullYear();
	  	    var nowmonth = today.getMonth();
	  	    var nowday = today.getDate();
	  	 
	  	    var birthyear = birth.getFullYear();
	  	    var birthmonth = birth.getMonth();
	  	    var birthday = birth.getDate();
	  	 
	  	    var age = nowyear - birthyear;
	  	    var age_month = nowmonth - birthmonth;
	  	    var age_day = nowday - birthday;
	  	    
	  	    if(age_month < 0 || (age_month == 0 && age_day <0)) {
	  	            age = parseInt(age) -1;
	  	        }
	  	    
	  	    if (age < 18) {
	  	    	$scope.error_birthday = "You must be over 18 to use this app.";
	  	    }
	  	    else {
	  	    	$scope.regHorse.age = age;
  	          	$http.post('/signup', $scope.regHorse).success(function(data){
  	        		if(data.state == 'success'){
  	        			currentUserService.setAuth(true);
  	        			$scope.userAuthenticated = currentUserService.getAuth;
						$localStorage.currUser = data.user._id;
  	        			$scope.scope_current_user = data.user._id;
  	        			$scope.regHorse = {username: '', password: '', lat: '', lon: '', birthday: '', gender: ''};
  	        			$location.path('/');
  	        		}
  	        		else{
  	        			$scope.error_message = data.message;
  	        		}
  	        	}).error(function(data, status){
  	        		$scope.error_message = "Please register with a different username.";
  	        	});
	  	    }
	  	
  	};

  	$scope.logIn = function(){
	  	$scope.logHorse.lat = $scope.myLat;
	  	$scope.logHorse.lon = $scope.myLon;
	  	$http.post('/login', $scope.logHorse).success(function(data){
			if(data.state == 'success'){
				currentUserService.setAuth(true);
				$scope.userAuthenticated = currentUserService.getAuth;
				console.log(data);
				$localStorage.currUser = data.user._id;
				$scope.scope_current_user = data.user._id;
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

	$scope.signout = function(){
		$http.get('/signout');
		currentUserService.setAuth(false);
		$scope.userAuthenticated = false;
		delete $localStorage.currUser;
		$scope.scope_current_user = "";
		$scope.error_message = "";
		currentUserService.goSettings('signout', $scope.matchPromise());
	};

	// This checks for whether the user has a current session or not
	// If is finds one automatically logs in else hits splash page
	$scope.checkSession = function(){
		$http.get('/success').success(function(data){
			if(data.state == 'success' && data.user){
				currentUserService.setAuth(true);
				$scope.userAuthenticated = currentUserService.getAuth;
				$scope.scope_current_user = data.user._id;
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
				$location.path('/register');
			}
		});
	};
		
	$scope.checkLocation();
	
	$scope.checkSession();	

});