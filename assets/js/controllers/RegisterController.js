
var registerController = function( $scope, $state, Auth ){

    var _self = this;

    _self.listAlerts = [];

    $scope.addAlert = function(type, options) {
        _self[type].push(options);
    };

    $scope.closeAlert = function(type, index) {
        _self[type].splice(index, 1);
    };

    _self.register = function() {

      _self.user.username = _self.user.email;

        Auth.register(_self.user).then(function( response ) {
        
          if ( response ) {
            $state.go('login');             
          }

        });
      
    };    
};


cereliApp.controller('registerController', registerController);

registerController.$inject = [ '$scope', '$state', 'Auth' ];
