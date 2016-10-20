(function(){

  'use strict';

  var lockUserController = function($scope, $state, AuthenticationFactory, LocalStorageFactory){

    var _self = this;

    $scope.errors = [];
    $scope.user = angular.fromJson(LocalStorageFactory.get('refresh_auth_token'));   
    $scope.success_redirect_state = angular.fromJson(LocalStorageFactory.get('refresh_redirect_state'));

    _self.passwordInputType = 'password';
    _self.showHidePasswordIcon = false;


    _self.filterUserObj = function( userObj ){   

      $scope.tempUser = angular.copy(userObj);
      userObj.password = '';

      delete userObj.fullName;    
    };  

    _self.togglePassword = function(){

      if ( _self.passwordInputType == 'password' ) {
        _self.passwordInputType = 'text';
        _self.showHidePasswordIcon = true;
      } else{
        _self.showHidePasswordIcon = false;
        _self.passwordInputType = 'password';
      }

    };

    $scope.login = function() {

      $scope.errors = [];

      AuthenticationFactory.login($scope.user).success(function(result) {

        if ( $scope.success_redirect_state && $scope.success_redirect_state.name !== '' ) {       
          $state.go($scope.success_redirect_state.name);  
        } else {          
          $state.go('admin.dashboard');         
        }

      }).error(function(err, data) {

        $scope.errors.push(err);            

      });

    }
      
    _self.filterUserObj($scope.user);

  };

  angular.module('cereliApp').controller('lockUserController', lockUserController);

  lockUserController.$inject = [ '$scope', '$state', 'AuthenticationFactory', 'LocalStorageFactory' ];

})();

