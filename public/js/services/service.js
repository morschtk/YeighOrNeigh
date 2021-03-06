var appServices = angular.module("appServices", ['ngResource']);

appServices.factory('currentUserService', function($location, $timeout) {
    var currUserCheck = undefined;
    var authUser = false;
    var settingsCheck = false;
    var editCheck = false;
    var matchCheck = false;
    var userBio = undefined;
    var userLat = undefined;
    var userLon = undefined;
    var desDist = undefined;
    var minAge = undefined;
    var maxAge = undefined;
    var bio = undefined;
    var name = undefined;
    var age = undefined;
    var miles = undefined;
    var timeAway = undefined;
    var possible = true;
    var matchPromise = null;
    var potentialMatches = [];
    var arrLikes = [];
    var arrDislikes = [];
    var arrLikedBy = [];
    var pictures = [];
    var desGender = [];

    return {
        goSettings: function(where, promise){
            switch(where){
                case 'settings':
                    $timeout.cancel(promise);
                    settingsCheck = true;
                    editCheck = false;
                    matchCheck = false;
                    $location.path('/settings');
                    break;
                case 'matches':
                    $timeout.cancel(promise);
                    settingsCheck = false;
                    editCheck = false;
                    matchCheck = true;
                    $location.path('/matches');
                    break;
                case 'home':
                    settingsCheck = false;
                    editCheck = false;
                    matchCheck = false;
                    $location.path('/');
                    break;
                case 'signout':
                    $timeout.cancel(promise);
                    settingsCheck = false;
                    editCheck = false;
                    matchCheck = false;
                    $location.path('/register');
                    break;
                case 'edit':
                    settingsCheck = false;
                    editCheck = true;
                    matchCheck = false;
                    $location.path('/editProfile');
                    break;
                default:
                    alert("Your Min age can not be larger then your max age.");
            }
        },
        getSettingsCheck: function() {
            return settingsCheck;
        },
        getEditCheck: function() {
            return editCheck;
        },
        getMatchCheck: function() {
            return matchCheck;
        },
        getCheck: function() {
            return currUserCheck;
        },
        setCheck: function(value) {
            currUserCheck = value;
        },
        getAuth: function() {
            return authUser;
        },
        setAuth: function(value) {
            authUser = value;
        },
        setBio: function(value) {
            userBio = value;
        },
        getBio: function() {
            return userBio;
        },
        getLat: function() {
            return userLat;
        },
        setLat: function(value) {
            userLat = value;
        },
        getLon: function() {
            return userLon;
        },
        setLon: function(value) {
            userLon = value;
        },
        getLikes: function(){
            return arrLikes;
        },
        setLikes: function(value) {
            arrLikes = value;
        },
        getLikedBy: function(){
            return arrLikedBy;
        },
        setLikedBy: function(value) {
            arrLikedBy = value;
        },
        getDislikes: function(){
            return arrDislikes;
        },
        setDislikes: function(value) {
            arrDislikes = value;
        },
        getDesGender: function(){
            return desGender;
        },
        setDesGender: function(value) {
            desGender = value;
        },
        getDesDist: function(){
            return desDist;
        },
        setDesDist: function(value) {
            desDist = value;
        },
        getMinAge: function(){
            return minAge;
        },
        setMinAge: function(value) {
            minAge = value;
        },
        getBio: function(){
            return bio;
        },
        setBio: function(value) {
            bio = value;
        },
        getName: function(){
            return name;
        },
        setName: function(value) {
            name = value;
        },
        getAge: function(){
            return age;
        },
        setAge: function(value) {
            age = value;
        },
        getMiles: function(){
            return miles;
        },
        setMiles: function(value) {
            miles = value;
        },
        getTimeAway: function(){
            return timeAway;
        },
        setTimeAway: function(value) {
            timeAway = value;
        },
        getMaxAge: function(){
            return maxAge;
        },
        setMaxAge: function(value) {
            maxAge = value;
        },
        getPics: function(){
            return pictures;
        },
        setPics: function(value) {
            pictures = value;
        },
        getPossible: function(){
            return possible;
        },
        setPossible: function(value) {
            possible = value;
        },
        getpotentialMatches: function(){
            return potentialMatches;
        },
        setpotentialMatches: function(value) {
            potentialMatches = value;
        },
        getMatchesPromise: function(){
            return matchPromise;
        },
        setMatchesPromise: function(value) {
            matchPromise = value;
        }
    };
});


appServices.factory('matchedUserService', function() {
  var matchedUser = '';
  var matchId = '';

  return {
    getMatchedUser: function(){
        return matchedUser;
    },
    setMatchedUser: function(value) {
        matchedUser = value;
    },
    getMatchId: function(){
        return matchId;
    },
    setMatchId: function(value) {
        matchId = value;
    }
  }
});

// Demonstrate how to register services
// In this case it is a simple value service.
appServices.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});

appServices.factory('potentialService',['$resource', function($resource){
    return $resource('/api/potentialHorses/:id', null,
        {
            'update': {method:'put'}
    });
}]);

appServices.factory('horseService',['$resource', function($resource){
    return $resource('/api/currHorse/:id', null,
        {
            'update': {method:'put'}
    });
}]);

appServices.factory('dislikeService',['$resource', function($resource){
    return $resource('/api/dislike/:id', null,
        {
            'update': {method:'put'}
    });
}]);

appServices.factory('likeService',['$resource', function($resource){
    return $resource('/api/like/:id', null,
        {
            'update': {method: 'put'}
    });
}]);

appServices.factory('settingService',['$resource', function($resource){
    return $resource('/api/settings/:id', null,
        {
            'update': {method:'put'}
    });
}]);

appServices.factory('matchesService',['$resource', function($resource){
    return $resource('/api/matches/:id', null,
        {
            'update': {method:'put'}
    });
}]);

appServices.factory('messageService',['$resource', function($resource){
    return $resource('/api/messages/:id', null,
        {
            'update': {method:'put'}
    });
}]);
