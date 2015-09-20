var appServices = angular.module("appServices", ['ngResource']);

appServices.factory('currentUserService', function() {
    var currUser = undefined;
    var authUser = false;
    return {
        getUser: function() {
            return currUser;
        },
        setUser: function(value) {
            currUser = value;
        },
        getAuth: function() {
            return authUser;
        },
        setAuth: function(value) {
            authUser = value;
        },
        
    };
});

appServices.factory('horseService',['$resource', function($resource){
    return $resource('/api/horses/:id', null,
        {
            'update': {method:'put'}
    });
}]);