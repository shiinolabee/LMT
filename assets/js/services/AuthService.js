
cereliApp.service('authService', ['$http', '$q', function( $http, $q ) {

    return {

        login: function(userData) {
            // return $auth.login(userData);
        },

        getAuthenticatedUser: function() {
            var defer = $q.defer();

            $http.get('/user')
                .success(function( response ){
                    defer.resolve(response);
                })
                .error(function( error ){
                    defer.reject(error);
                })
            ;

            return defer.promise;
        },

        logout: function() {
            // return $auth.logout();
        }
    }
}]);