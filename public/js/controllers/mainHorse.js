var appHorse = angular.module("appHorse", ['ngMaterial', 'ngStorage']);

appHorse.controller('horseController', function($scope, $timeout, $http, $location, potentialService, dislikeService, likeService, currentUserService, $localStorage) {
  if(currentUserService.getCheck() === undefined){
  	$location.path('/');
  }else{
	  $scope.horse = {};

	  $scope.mainUser = $localStorage.currUser;
	  $scope.mainLon = currentUserService.getLon();
	  $scope.mainLat = currentUserService.getLat();
	  $scope.mainLikes = currentUserService.getLikes();
	  $scope.mainDislikes = currentUserService.getDislikes();
	  $scope.mainDesGender = currentUserService.getDesGender();
	  $scope.mainDesDist = currentUserService.getDesDist();
	  $scope.mainMinAge = currentUserService.getMinAge();
	  $scope.mainMaxAge = currentUserService.getMaxAge();

	  $scope.userData = {
	  	id: $scope.mainUser,
		lon: $scope.mainLon,
		lat: $scope.mainLat,
		theLikes: $scope.mainLikes,
		theDislikes: $scope.mainDislikes,
		theDesGender: $scope.mainDesGender,
		theDesDist: $scope.mainDesDist,
		theMinAge: $scope.mainMinAge,
		theMaxAge: $scope.mainMaxAge
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

	  $http.put('/api/potentialHorses', $scope.userData).success(function(horseData, status){
	  	$scope.horses = horseData;
	  	$scope.horse = $scope.horses[0];
		console.log($scope.horses[0]);
		if($scope.horses[0] === undefined){
			console.log("Display there are no horses in area");
		};
		$scope.pictures = $scope.horses[0].pictures[0].path;
	  	$scope.horse.name = $scope.horses[0].username;
	  	$scope.horse.bio = $scope.horses[0].bio;
	  	$scope.horse.age = $scope.getAge($scope.horses[0].birthday);
	  	$scope.horse.distance = $scope.horses[0].miles_away;

	  	var aDate = new Date($scope.horses[0].last_logged);
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
	  	$scope.horse.lastSeen = timeElapsed;
	  });

	  $scope.dislike = function(ahorse){
	  	$scope.dislikedHorse = {
	  		id: ahorse._id
	  	};
		dislikeService.update({id: $localStorage.currUser}, $scope.dislikedHorse);
	  	$scope.card = !$scope.card;
	  	$scope.horses.shift();   	

		$timeout(function(){
			$scope.horse = $scope.horses[0];
			$scope.horse.name = $scope.horses[0].username;
		  	$scope.horse.bio = $scope.horses[0].bio;
		  	$scope.horse.age = $scope.getAge($scope.horses[0].birthday);
		  	$scope.milesAway = $scope.horses[0].miles_away.toString().split(".");
		  	if($scope.milesAway[0] < 2){
		  		$scope.horse.distance = "1 mile";
		  	}else{
		  		$scope.horse.distance = $scope.milesAway[0] + " miles";
		  	}

	  	  	var aDate = new Date($scope.horses[0].last_logged);
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
	  	  	$scope.horse.lastSeen = timeElapsed;

			$scope.details = false;
			$scope.card = !$scope.card;
		}, 300);
	  };

	  $scope.like = function(ahorse){
	  	$scope.likedHorse = {
	  		id: ahorse._id
	  	};
	  	likeService.update({id: $localStorage.currUser}, $scope.likedHorse);
	  	$scope.card = !$scope.card;
	  	$scope.horses.shift();

	  	$timeout(function(){
	  		$scope.horse = $scope.horses[0];
	  		$scope.horse.name = $scope.horses[0].username;
		  	$scope.horse.bio = $scope.horses[0].bio;
		  	$scope.horse.age = $scope.getAge($scope.horses[0].birthday);
		  	$scope.milesAway = $scope.horses[0].miles_away.toString().split(".");
		  	if($scope.milesAway[0] < 2){
		  		$scope.horse.distance = "1 mile";
		  	}else{
		  		$scope.horse.distance = $scope.milesAway[0] + " miles";
		  	}

//Possibly put this code on server and just return lastSeen like miles_away
	  	  	var aDate = new Date($scope.horses[0].last_logged);
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
	  	  	$scope.horse.lastSeen = timeElapsed;

	  		$scope.details = false;
			$scope.card = !$scope.card;
		}, 300);
	  };

	  $scope.showDetails = function(){
	  	if($scope.details){
	  		$scope.details = false;
	  	}else{
	  		$scope.details = true;
	  	}
	  };
  };
});