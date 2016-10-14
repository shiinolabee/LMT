
var loginController = function( $scope, $state, Auth ) {

    var _self = this;

    _self.passwordInputType = 'password';
    _self.showHidePasswordIcon = false;

    _self.togglePassword = function(){

      if ( _self.passwordInputType == 'password' ) {
        _self.passwordInputType = 'text';
        _self.showHidePasswordIcon = true;
      } else{
        _self.showHidePasswordIcon = false;
        _self.passwordInputType = 'password';
      }

    };


    $scope.errors = [];

    $scope.login = function() {

      $scope.errors = [];

      Auth.login($scope.user).success(function(result) {

        $state.go('admin.dashboard');

      }).error(function(err, data) {

        $scope.errors.push(err);            

      });

    }

};

cereliApp.controller('loginController', loginController);

loginController.$inject = [ '$scope', '$state', 'Auth' ];