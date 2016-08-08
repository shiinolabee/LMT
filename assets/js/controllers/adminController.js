
cereliApp
    .controller('adminController', [ '$scope', function( $scope ){     

        $scope.selectedMenu = 0;


        $scope.checkToggleMenu = function( selectedMenu ){
          
            if( selectedMenu == $scope.selectedMenu){
                $scope.selectedMenu = 0;            
            }            
            else {
                $scope.selectedMenu = selectedMenu;
            }       
            
        };


    }])