
cereliApp
    .controller('employeeController', [ '$scope', '$uibModal', 'employeeService',  function( $scope, $uibModal, employeeService ){

        $scope.employee = {};
        $scope.employeeList = [];        

        $scope.getEmployee = function() {};

        $scope.addEmployee = function( employee ) {

            $scope.editMode = false;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/employees/form.html',

                //binds $scope properties to the controller
                bindToController : true,

                windowTemplateUrl : 'templates/common/ui-modal.html',

                controller: function( $scope ) {

                    $scope.modalOptions = {
                        headerText : 'Add Employee',    
                        closeButtonText : 'Cancel',
                        actionButtonText : !$scope.editMode ? 'Save' : 'Save changes',

                        // execute when saving form
                        ok : function( result ) {

                            modalInstance.close(result);
                            
                            console.log('submit form')

                        },

                        close : function(){
                            modalInstance.dismiss('cancel');
                        }
                    };

                },
                controllerAs : "employeeModalController",
                size: 'lg'    

            });   

            modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedItem;
            }, function () {
              // $log.info('Modal dismissed at: ' + new Date());
            }); 

            // employeeService.addEmployee(employee).then(function( response ) {

            //     if ( response.data ) {
            //         $scope.employeeList.push(response.data);
            //     }

            //     $scope.employee = {};

            // });

        };

        $scope.editEmployee = function( employee ) {

            $scope.editMode = true;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/employees/form.html',

                //binds $scope properties to the controller
                bindToController : true,

                windowTemplateUrl : 'templates/common/ui-modal.html',

                controller: function( $scope ) {

                    $scope.modalOptions = {
                        headerText :  !$scope.editMode ? 'New Employee' : 'Edit Employee',    
                        closeButtonText : 'Cancel',
                        actionButtonText : !$scope.editMode ? 'Save' : 'Save changes',

                        // execute when saving form
                        ok : function() {
                            console.log('submit form')
                        },

                        close : function(){
                            modalInstance.dismiss('cancel');
                        }
                    };

                },
                controllerAs : "employeeModalController",
                size: 'lg'    

            });    

            employeeService.editEmployee( employee ).then(function( response ){

            })

        }

    }]);