(function(){

    'use strict';

    var adminController = function( $scope, AuthenticationFactory, $state, $sce, $http, $timeout ){

        $scope.selectedMenu = 0;

        $scope.clock = "loading clock..."; // initialise the time variable
        $scope.tickInterval = 1000; //ms    

        var tick = function() {
            $scope.clock = Date.now() // get the current time
            $timeout(tick, $scope.tickInterval); // reset the timer
        }

        // Start the timer
        $timeout(tick, $scope.tickInterval);

        $scope.checkToggleMenu = function( selectedMenu ){
          
            if( selectedMenu == $scope.selectedMenu){
                $scope.selectedMenu = 0;            
            }            
            else {
                $scope.selectedMenu = selectedMenu;
            }               
        };

        $scope.logout = function(){
            AuthenticationFactory.logout();         
            $state.go('admin.login');   
        };

    };

    angular.module('cereliApp').controller('adminController', adminController);

    adminController.$inject = [ '$scope', 'AuthenticationFactory', '$state', '$sce', '$http', '$timeout' ];

})();
