
var adminController = function( $scope, Auth, $state, $sce, $http, $timeout ){

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
        Auth.logout();         
        $state.go('login');   
    };        

    // $scope.rightAccountPopover = getRightAccountPopoverContent.data;

    // get and compile right account popover template
    // $scope.rightAccountPopover = $sce.trustAsHtml( $scope.rightAccountPopover );        
    // $scope.rightAccountPopover = $sce.trustAsHtml( $http.get('templates/common/right-account-popover.html').data );        

    // $http.get('templates/common/right-account-popover.html').then(function( response ){
    //     $scope.rightAccountPopover = $sce.trustAsHtml( response.data );        
    //     // $scope.rightAccountPopover = $sce.trustAsHtml( '<b>test</b>' );        
    //     console.log($scope.rightAccountPopover);        
    // });


};

cereliApp.controller('adminController', adminController);

adminController.$inject = [ '$scope', 'Auth', '$state', '$sce', '$http', '$timeout' ];