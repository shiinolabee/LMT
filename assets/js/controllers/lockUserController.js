var lockUserController = function($scope, $state, Auth, LocalService){

 	var _self = this;

    $scope.errors = [];
 	$scope.user = angular.fromJson(LocalService.get('refresh_auth_token'));

 	_self.filterUserObj = function( userObj ){ 		

 		$scope.tempUser = angular.copy(userObj);
 		userObj.password = '';

 		delete userObj.fullName; 		
 	};	


    $scope.login = function() {

      $scope.errors = [];

      Auth.login($scope.user).success(function(result) {

        $state.go('admin.dashboard');

      }).error(function(err, data) {

        $scope.errors.push(err);            

      });

    }
    
 	_self.filterUserObj($scope.user);
};

cereliApp.controller('lockUserController', lockUserController);

lockUserController.$inject = [ '$scope', '$state', 'Auth', 'LocalService' ];