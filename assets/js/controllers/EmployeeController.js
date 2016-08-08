
cereliApp
    .controller('employeeController', [ '$scope', '$uibModal', 'employeeService',  function( $scope, $uibModal, employeeService ){

        $scope.employeeListAlerts = [];

        $scope.addAlert = function(type, options) {
            $scope[type].push(options);
        };

        $scope.closeAlert = function(type, index) {
            $scope[type].splice(index, 1);
        };

        $scope.initEmployeeValues = function( isEditMode, index){

            if ( !isEditMode && index == 0 ) {
                var employee = {
                    id : '',
                    empId : '',
                    position : '',
                    paidLeaveLimit : 0,
                    unpaidLeaveLimit : 0,
                    noOfAbsences : 0,
                    noOfLates: 0,
                    totalOvertime : 0,
                    recordStatus : 1,
                    firstName : '',
                    lastName : '',
                    contactNumber : '',
                    emailAddress : ''
                };
                
            } else {                
                var employee = $scope.employeeList[index];
            }

            return employee;
        };

        $scope.employeeList = [];        

        $scope.getEmployee = function( id ) {
            employeeService.getEmployee( id ).then(function(){

            });
        };

        $scope.getListEmployees = function() {

            employeeService.getListEmployees().then(function( response ){

                console.log(response);

                $scope.employeeList = response;
            })
        };

        $scope.getListEmployees();

        $scope.saveEmployee = function( index, isEditMode ) {

            $scope.editMode = isEditMode;
            $scope.index = index;

            var modalInstance = $uibModal.open({
                animation: true,
                keyboard : false,
                resolve : {
                    employeeInitialValues : function() {
                        return $scope.initEmployeeValues($scope.editMode, $scope.index);
                    },
                    isEditMode : function(){
                        return $scope.editMode;
                    }
                },                
                
                templateUrl: 'templates/employees/form.html',                
                
                windowTemplateUrl : 'templates/common/ui-modal.html',
                
                size: 'lg',

                controller: function( $scope, employeeInitialValues, isEditMode ) {

                    $scope.employee = employeeInitialValues;
                    $scope.editMode = isEditMode;                    

                    /**
                    * Set Modal options such as messages, text, labels, etc
                    **/
                    $scope.modalOptions = {
                        headerText : !$scope.editMode ? 'New Employee' : 'Edit Employee',    
                        closeButtonText : 'Cancel',
                        actionButtonText : !$scope.editMode ? 'Save' : 'Save changes',

                        // execute when saving form
                        ok : function( result ) {

                            var responseData, id;                                                   

                            employeeService.saveEmployee($scope.employee, $scope.editMode).then(function( response ) {

                                if ( response.success ) {
                                    responseData = response;                                                                        
                                }

                            }, function(){

                                responseData = {
                                    success: false,
                                    errors: ['Unknown error occured while deleting client note']
                                };

                            }).finally(function(){
                                // $uibModalInstance.close(responseData);
                                modalInstance.close(responseData);
                            });
                        },

                        close : function(){
                            modalInstance.dismiss('cancel');
                        }
                    };

                }
            });   

            modalInstance.result.then(function( responseData ){

                if ( responseData.success ) {

                    $scope.getListEmployees();        

                    $scope.addAlert('employeeListAlerts', {
                        type: 'success',
                        msg: 'Employee Details Successfully Added'
                    });                                                              
                }

            });

        };     


        $scope.searchEmployee = function(){

        };

        $scope.removeEmployee = function( id, index ) {

            var modalInstance = $uibModal.open({
                    animation: true,
                    keyboard: false,
                    backdrop: 'static',                    
                    templateUrl: 'templates/common/modal.html',          
                    windowTemplateUrl : 'templates/common/ui-modal.html',
                    resolve: {                       
                        employeeId: function() {
                            return id;
                        },
                        index: function() {
                            return index;
                        }
                    },
                    size: 'sm',
                    controller: function($scope, $uibModalInstance, employeeId, index, employeeService) {                       

                        $scope.modalOptions = {
                            closeButtonText: 'Cancel',
                            actionButtonText: 'Delete Employee Details',
                            headerText: 'Delete Employee details?',
                            bodyText: 'Are you sure you want to delete this employee details?'
                        };

                        $scope.modalOptions.ok = function (result) {

                            var responseData;

                            employeeService.removeEmployee(employeeId).then(function(response) {

                                if ( response.success ) {
                                    responseData = response;                                    
                                }
                            }, function() {
                                responseData = {
                                    success: false,
                                    errors: ['Unknown error occured while deleting client note']
                                };

                            }).finally(function(){
                                modalInstance.close(responseData);                                
                            });                      
                        };

                        $scope.modalOptions.close = function (result) {
                            // $uibModalInstance.dismiss('cancel');
                            $uibModalInstance.dismiss('cancel');
                        };

                    }
                });

                modalInstance.result.then(function(responseData) {

                    if ( responseData.success ) {

                        $scope.employeeList.splice(index, 1);
                        $scope.getListEmployees();

                        $scope.addAlert('employeeListAlerts', {
                            type: 'success',
                            msg: 'Employee Details Successfully Deleted'
                        });                    
                        
                    }

                });

            // employeeService.remove(id).then(function( response ) {

            //     if ( response.empId ) {
            //         // modalInstance.close(response);
            //         $scope.getListEmployees();
            //         $scope.employeeList.splice(id, 1);
            //     }

            // });
        };

    }]);