(function(){

  'use strict';

  var currentUserFactory = function( LocalStorageFactory ){

    return {

      user: function() {
       
        if (LocalStorageFactory.get('auth_token')) {
          return angular.fromJson(LocalStorageFactory.get('auth_token')).user;
        } else {
          return {};
        }
        
      }

    };

  };

  angular.module('cereliApp').factory('CurrentUserFactory', currentUserFactory);

  currentUserFactory.$inject = [ 'LocalStorageFactory' ];

})();