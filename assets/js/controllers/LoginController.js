
var loginController = function( $scope, $state, Auth ) {

    var _self = this;

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