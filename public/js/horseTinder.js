var app = angular.module('horseTinder', ['ngMaterial', 'ngRoute', 'appHorse', 'appSettings', 'appAuth', 'appLoad', 'appServices', 'ngMdIcons']);

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

    .when('/settings', {
      templateUrl: '/settings.html',
      controller: 'settingController',
      controlleras: 'settingCtrl'
    })

    .when('/register', {
      templateUrl: '/register.html'
    });
});
