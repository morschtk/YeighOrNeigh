var appHorse = angular.module("appHorse", ['ngMaterial']);

appHorse.controller('horseController', function($scope, $timeout, $http, horseService) {
  $scope.horse = {};
  var myLat;
  var myLon;
  $scope.card = true;
  $scope.details = false;
  $scope.allTheHorses = horseService.query();
  console.log($scope.allTheHorses);
  
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
  	$scope.card = !$scope.card;
  	$scope.horses.shift();   	

	$timeout(function(){
		$scope.horse = $scope.horses[0];
		$scope.details = false;
		$scope.card = !$scope.card;
	}, 300);
  };

  $scope.like = function(ahorse){
  	$scope.card = !$scope.card;
  	$scope.horses.shift();

  	$timeout(function(){
  		$scope.horse = $scope.horses[0];
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

});