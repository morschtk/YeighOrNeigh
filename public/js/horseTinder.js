var app = angular.module('horseTinder', ['ngMaterial', 'ngRoute', 'appHorse', 'appAuth', 'appServices', 'ngMdIcons']);

app.config(function($routeProvider){
	$routeProvider
    .when('/', {
      templateUrl: '/mainPage.html',
      controller: 'horseController',
      controlleras: 'horseCtrl'
    })

    .when('/register', {
      templateUrl: '/register.html'
    });
});
