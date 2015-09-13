var app = angular.module('horseTinder', ['ngMaterial', 'ngRoute', 'appHorse', 'ngMdIcons']);

app.config(function($routeProvider){
	$routeProvider
    .when('/', {
      templateUrl: '/mainPage.html',
      controller: 'horseController',
      controllerAs: 'horseCtrl'
    })
    .when('/ahorse', {
      templateUrl: '/horsesPage.html',
      controller: 'horseController',
      controllerAs: 'horseCtrl'
    });
});
