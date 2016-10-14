
cereliApp

  .factory('Auth', function($http, LocalService, AccessLevels) {

    return {

      authorize: function(access) {

        if (access === AccessLevels.user) {
          return this.isAuthenticated();
        } else {
          return true;
        }

      },

      isAuthenticated: function() {
        return LocalService.get('auth_token');
      },

      login: function(credentials) {

        var login = $http.post('/auth/authenticate', credentials, {
            withCredentials: true
        });
        
        login.success(function(result) {
            LocalService.set('auth_token', JSON.stringify(result));
        });

        return login;
      },

      logout: function() {

        // The backend doesn't care about logouts, delete the token and you're good to go.
        LocalService.unset('auth_token');
        LocalService.unset('refresh_auth_token');
        
      },

      register: function(formData) {

        LocalService.unset('auth_token');

        var register = $http.post('/auth/register', { data : formData });

        // register.success(function(result) {
        //     console.info('Setting Auth_token to Local Storage...');
        //     LocalService.set('auth_token', JSON.stringify(result));
        // });

        return register;
        
      }
    }
  })

  .factory('AuthInterceptor', [ '$q', '$injector', '$rootScope', function($q, $injector, $rootScope) {

    var LocalService = $injector.get('LocalService');

    return {

      request: function(config) {

        var token;

        if (LocalService.get('auth_token')) {
          token = angular.fromJson(LocalService.get('auth_token')).token;
        }

        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }

        return config;
      },

      responseError: function(response) {

        if (response.status === 401 || response.status === 403) {

          if ( angular.fromJson(LocalService.get('auth_token')) ) {

            var expiredUser = angular.fromJson(LocalService.get('auth_token')).user;

            LocalService.set('refresh_auth_token', JSON.stringify(expiredUser));
            LocalService.unset('auth_token');

          }

          if ( $rootScope.$state.current ) { 
            LocalService.set('refresh_redirect_state', JSON.stringify($rootScope.$state.current));
          }     

          if ( !$rootScope.$state.current.name == 'admin.lock-user' ) {
            $injector.get('$state').go('admin.lock-user');            
          }

        }

        return $q.reject(response);
      }
    }

  }])

  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });