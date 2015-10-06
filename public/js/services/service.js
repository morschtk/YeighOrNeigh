var appServices = angular.module("appServices", ['ngResource']);

appServices.factory('currentUserService', function() {
    var currUserCheck = undefined;
    var authUser = false;
    var userLat = undefined;
    var userLon = undefined;
    var arrLikes = [];
    var arrDislikes = [];
    var arrLikedBy = [];

    return {
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