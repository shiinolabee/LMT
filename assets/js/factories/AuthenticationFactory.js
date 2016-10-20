(function(){

  'use strict';

  var authenticationFactory = function( $http, LocalStorageFactory, AccessLevels ){

    return {

      authorize: function(access) {

        if (access === AccessLevels.user) {          
          return this.isAuthenticated();
        } else {
          return true;
        }

      },

      isAuthenticated: function() {        
        return LocalStorageFactory.get('auth_token');
      },

      login: function(credentials) {

        var login = $http.post('/auth/authenticate', credentials, {
            withCredentials: true
        });
        
        login.success(function(result) {
            LocalStorageFactory.set('auth_token', JSON.stringify(result));           
        });

        return login;
      },

      logout: function() {

        // The backend doesn't care about logouts, delete the token and you're good to go.
        LocalStorageFactory.unset('auth_token');
        LocalStorageFactory.unset('refresh_auth_token');
        
      },

      register: function(formData) {

        LocalStorageFactory.unset('auth_token');

        var register = $http.post('/auth/register', { data : formData });

        // register.success(function(result) {
        //     console.info('Setting Auth_token to Local Storage...');
        //     LocalStorageFactory.set('auth_token', JSON.stringify(result));
        // });

        return register;
        
      }
    }

  };

  var authInterceptor = function( $q, $injector, $rootScope ){

    var LocalStorageFactory = $injector.get('LocalStorageFactory');

    return {

      request: function(config) {

        var token;

        if (LocalStorageFactory.get('auth_token')) {
          token = angular.fromJson(LocalStorageFactory.get('auth_token')).token;
        }

        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }

        return config;
      },

      responseError: function(response) {

        if (response.status === 401 || response.status === 403) {        

          if ( LocalStorageFactory.get('auth_token') !== null ) {

            var expiredUser = angular.fromJson(LocalStorageFactory.get('auth_token')).user;

            LocalStorageFactory.set('refresh_auth_token', JSON.stringify(expiredUser));
            LocalStorageFactory.unset('auth_token');

            if ( expiredUser ){
              $injector.get('$state').go('admin.lock-user');                                  
            }

          }

          if ( $rootScope.$state.current ) { 
            LocalStorageFactory.set('refresh_redirect_state', JSON.stringify($rootScope.$state.current));
          } 

        }

        return $q.reject(response);
      }
    }

  }; 

  angular.module('cereliApp').factory('AuthenticationFactory', authenticationFactory);

  angular.module('cereliApp').factory('AuthInterceptor', authInterceptor)

  authInterceptor.$inject = [ '$q', '$injector', '$rootScope' ];

  angular.module('cereliApp').config([ '$httpProvider', function($httpProvider) {

    $httpProvider.interceptors.push('AuthInterceptor');
    
  }]);

  authenticationFactory.$inject = [ '$http', 'LocalStorageFactory', 'AccessLevels' ];

})();