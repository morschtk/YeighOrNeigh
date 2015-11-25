var appHorse = angular.module("appHorse", ['ngMaterial', 'ngStorage']);

appHorse.controller('horseController', function($scope, $timeout, $http, $location, potentialService, dislikeService, likeService, currentUserService, $localStorage) {
  if(currentUserService.getCheck() === undefined){
  	$location.path('/');
  }else{
	$scope.horse = {};

	$scope.imagePos = 0;
	$scope.dontShow = false;

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

	currentUserService.setPossible(true);

  	$scope.horses = currentUserService.getpotentialMatches();
  	$scope.horse = $scope.horses[0];

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
	  // 	}
	  // });

	$scope.dislike = function(ahorse){
		$scope.dislikedHorse = {
			id: ahorse._id
		};
		dislikeService.update({id: $localStorage.currUser}, $scope.dislikedHorse);
		$scope.card = !$scope.card;
		$scope.horses.shift();

		if($scope.horses[0] == undefined){
			$location.path('/');
		}else{
  			$timeout(function(){
  				$scope.horse = $scope.horses[0];
  				$scope.horse.name = $scope.horses[0].username;
  				$scope.pictures = $scope.horses[0].pictures[0].path;
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
	  	}		
	};

	$scope.like = function(ahorse){
		$scope.likedHorse = {
			id: ahorse._id
		};
		likeService.update({id: $localStorage.currUser}, $scope.likedHorse);
		$scope.card = !$scope.card;
		$scope.horses.shift();

		if($scope.horses[0] == undefined){
			$location.path('/');
		}else{
		  	$timeout(function(){
		  		$scope.horse = $scope.horses[0];
		  		$scope.horse.name = $scope.horses[0].username;
		  		$scope.pictures = $scope.horses[0].pictures[0].path;
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
		}
	};

	$scope.showDetails = function(){
		if(!$scope.dontShow){
			if($scope.details){
		  		$scope.details = false;
		  	}else{
		  		$scope.details = true;
		  	}
	  	}
	  	$scope.dontShow = false;
	};

	$scope.onSwipeLeft = function(ev) {
		$scope.dontShow = true;
		if($scope.details == false){
			$scope.like($scope.horse)
		}else{
			if($scope.imagePos !== ($scope.horses[0].pictures.length-1)){
				$scope.imagePos++;
			}
			$scope.pictures = $scope.horses[0].pictures[$scope.imagePos].path;
		}
    };

    $scope.onSwipeRight = function(ev) {
    	$scope.dontShow = true;
		if($scope.details == false){
			$scope.dislike($scope.horse)
		}else{
			if($scope.imagePos !== 0){
				$scope.imagePos--;
			}
			$scope.pictures = $scope.horses[0].pictures[$scope.imagePos].path;
		}
    };
    
  };
});