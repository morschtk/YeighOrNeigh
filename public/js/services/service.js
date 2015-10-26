var appServices = angular.module("appServices", ['ngResource']);

appServices.factory('currentUserService', function($location) {
    var currUserCheck = undefined;
    var authUser = false;
    var settingsCheck = false;
    var editCheck = false;
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
    var arrLikes = [];
    var arrDislikes = [];
    var arrLikedBy = [];
    var pictures = [];
    var desGender = [];

    return {
        goSettings: function(where){
        console.log(where);
            switch(where){
                case 'settings':
                    settingsCheck = true;
                    editCheck = false;
                    $location.path('/settings');
                    break;
                case 'home':
                    settingsCheck = false;
                    editCheck = false;
                    $location.path('/');
                    break;
                case 'edit':
                    settingsCheck = false;
                    editCheck = true;
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

