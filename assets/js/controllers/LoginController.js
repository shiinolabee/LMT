
cereliApp
    .controller('loginController', function($scope, $state, Auth) {
    
        $scope.errors = [];

        $scope.login = function() {

          $scope.errors = [];

          Auth.login($scope.user).success(function(result) {

            $state.go('user.messages');

          }).error(function(err, data) {

            $scope.errors.push(err);

            console.log(data)

          });

        }

  });