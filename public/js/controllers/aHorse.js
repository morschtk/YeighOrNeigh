var appHorse = angular.module("appHorse", ['ngMaterial']);

appHorse.controller('horseController', function($scope, $timeout, $location, $http) {
  $scope.horse = {};
  var myLat;
  var myLon;
  $scope.card = true;
  $scope.details = false;
  $scope.aHorse = {username: '', password: '', lat: '', lon: ''};
  $scope.error_message = '';
  $scope.horses = [
	  {
	  	imagePath: 'images/horse1.jpg',
	  	distance: '69',
	  	name: 'Rudolf',
	  	age: '21',
	  	bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras feugiat maximus convallis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed gravida nisl ut mauris aliquam pulvinar quis vitae velit.'
	  },{
	  	imagePath: 'images/horse2.jpg',
	  	distance: '12',
	  	name: 'pegs',
	  	age: '21',
	  	bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras feugiat maximus convallis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed gravida nisl ut mauris aliquam pulvinar quis vitae velit.'
	  },{
	  	imagePath: 'images/horse3.jpg',
	  	distance: '35',
	  	name: 'Janet',
	  	age: '21',
	  	bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras feugiat maximus convallis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed gravida nisl ut mauris aliquam pulvinar quis vitae velit.'
	  },{
	  	imagePath: 'images/horse4.jpg',
	  	distance: '2',
	  	name: 'Bill',
	  	age: '21',
	  	bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras feugiat maximus convallis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed gravida nisl ut mauris aliquam pulvinar quis vitae velit.'
	  }
  ];
  $scope.horse = $scope.horses[0];

  $scope.dislike = function(ahorse){
  	console.log(ahorse);
  	$scope.card = !$scope.card;
  	$scope.horses.shift();  	

	$timeout(function(){
		$scope.horse = $scope.horses[0];
		$scope.details = false;
		$scope.card = !$scope.card;
		// $location.path('/');
	}, 300);
  };

  $scope.like = function(ahorse){
  	console.log(ahorse);
  	$scope.card = !$scope.card;
  	$scope.horses.shift();

  	$timeout(function(){
  		$scope.horse = $scope.horses[0];
  		$scope.details = false;
		$scope.card = !$scope.card;
		// $location.path('/');
	}, 300);
  };

  $scope.register = function(){
  	console.log(myLat);
  	console.log(myLon);
  	$scope.aHorse.lat = myLat;
  	$scope.aHorse.lon = myLon;
  	$http.post('/signup', $scope.aHorse).success(function(data){
		if(data.state == 'success'){
			//$rootScope.authenticated = true;
			//$scope.scope_current_user = data.user.username;
			$location.path('/');
		}
		else{
			$scope.error_message = data.message;
		}
	});
  };

  $scope.checkLocation = function(){ 
	//check for geolocation support
	if (navigator.geolocation) {
		console.log('geolocation is supported!');

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

  $scope.checkLocation();

  $scope.signout = function(){
	$http.get('/signout');
	// $rootScope.authenticated = false;
	// $scope.scope_current_user = "";
	$location.path('/');
  };

});