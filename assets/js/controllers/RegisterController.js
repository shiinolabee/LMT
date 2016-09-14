cereliApp
    .controller('registerController', function($scope, $state, Auth) {

        $scope.register = function() {

          Auth.register($scope.user).then(function() {
            $state.go('anon.home');
          });
          
        }
        
    });
