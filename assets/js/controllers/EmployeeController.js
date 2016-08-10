
cereliApp
    .controller('employeeController', [ '$scope', '$uibModal', 'employeeService',  function( $scope, $uibModal, employeeService ){

        $scope.employeeListAlerts = [];
        $scope.employeeList = [];        

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
                var employee = angular.copy($scope.employeeList[index]);
            }

            return employee;
        };

        $scope.getListEmployees = function() {

            employeeService.getListEmployees().then(function( response ){

                console.log(response);

                $scope.employeeList = response;
            });
        };        

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
                size: 'md',
                controller: function( $scope, employeeInitialValues, isEditMode ) {

                    $scope.employee = employeeInitialValues;
                    $scope.editMode = isEditMode;                    
                    
                    /**
                    * Set Modal options such as messages, text, labels, etc
                    **/
                    $scope.modalOptions = {
                        headerText : !$scope.editMode ? 'New Employee' : 'Edit Employee Details',    
                        closeButtonText : 'Cancel',
                        actionButtonText : !$scope.editMode ? 'Save' : 'Save changes',

                        // execute when saving form
                        ok : function( result ) {

                            var responseData, id;                                                   

                            employeeService.saveEmployee($scope.employee, $scope.editMode).then(function( response ) {

                                if ( response.success ) {
                                    responseData = response;                                                                        
                                }

                            }, function(xhr, errMsg){

                                responseData = {
                                    success: false,
                                    errors: ['Unknown error occured while deleting client note']
                                };

                            }).finally(function(){                                
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
                        msg: 'Employee Details Successfully ' + ( isEditMode ? 'Updated' : 'Added' )
                    });                                                              
                }

            });

        };     

        /**
        * Checks employee id exists in collection
        **/
        $scope.checkEmpIdExists = function( val ){

        };


        /**
        * Fetches employee in search box via string
        **/
        $scope.searchEmployee = function( val ){

            return employeeService.getEmployee( val );                

        };

        /**
        * Removes/Deletes employee by id        
        **/
        $scope.removeEmployee = function( id, index ) {

            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: false,
                backdrop: 'static',                    
                templateUrl: 'templates/common/modal.html',          
                windowTemplateUrl : 'templates/common/ui-modal.html',
                resolve: {                       
                    employeeDetails: function() {
                        return $scope.employeeList[index];
                    },
                    index: function() {
                        return index;
                    }
                },
                size: 'sm',
                controller: function($scope, $uibModalInstance, employeeDetails, index, employeeService) {                       

                    $scope.modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Delete Employee Details',
                        headerText: 'Delete Employee details?',
                        bodyText: 'Are you sure you want to delete employ ' + (employeeDetails.firstName + ' ' + employeeDetails.lastName) + '\'s details?'
                    };

                    $scope.modalOptions.ok = function (result) {

                        var responseData;

                        employeeService.removeEmployee(employeeDetails.id).then(function(response) {

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
        };


        /**
        * Import Time Records via csv file        
        **/
        $scope.importTimeRecords = function(){

            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: false,                
                templateUrl: 'templates/employees/import-modal.html',          
                windowTemplateUrl : 'templates/common/ui-modal.html',             
                size: 'md',
                controller: function($scope, $uibModalInstance, employeeService) {                       

                    $scope.modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Import & Save',
                        headerText: 'Import Employee Time Records',                        
                    };

                    $scope.modalOptions.ok = function (result) {

                        var responseData;

                        employeeService.saveImportedTimeRecords().then(function(response) {

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
        };

        $scope.saveTimeRecord = function(){

            var modalInstance = $uibModal.open({
                animation : true,
                size : 'md'
            });

        };

        $scope.getListEmployees();

    }]);