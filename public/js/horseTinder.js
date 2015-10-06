var app = angular.module('horseTinder', ['ngMaterial', 'ngRoute', 'appHorse', 'appAuth', 'appLoad', 'appServices', 'ngMdIcons']);

app.config(function($routeProvider){
	$routeProvider
    .when('/', {
      templateUrl: '/loading.html',
      controller: 'loadController',
      controlleras: 'loadCtrl'
    })

    .when('/home', {
      templateUrl: '/mainPage.html',
      controller: 'horseController',
      controlleras: 'horseCtrl'
    })

    .when('/register', {
      templateUrl: '/register.html'
    });
});
