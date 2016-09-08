
cereliApp
    .controller('employeeController', [ '$scope', '$uibModal', 'activeRecordService', 'pagerService', 'moment', 'calendarConfig', 'uibDateParser', 'getDepartmentList',  
        function( $scope, $uibModal, activeRecordService, pagerService, moment, calendarConfig, uibDateParser, getDepartmentList ){

        $scope.employeeListAlerts = [];
        $scope.employeeList = [];  
        $scope.departmentList = getDepartmentList.data; // get department lists        

        $scope.recordStatusArr = [ 
            {  name : 'Active', value : 1 },
            {  name : 'Inactive', value : 0}
        ];

        $scope.genderArr = [
            { name : 'Male', value : 1 },
            { name : 'Female', value : 0}
        ];

        $scope.dummyEmployeeList = [];  

        $scope.pager = {};        

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
                    departmentAssigned : '',
                    dateHired : new Date(),
                    dateRegularized : new Date(),
                    paidLeaveLimit : 0,
                    unpaidLeaveLimit : 0,
                    noOfAbsences : 0,
                    noOfLates: 0,
                    totalOvertime : 0,
                    recordStatus : 1,                    
                    firstName : '',
                    lastName : '',
                    contactNumber : '',
                    gender : '',
                    homeAddress : '',
                    emailAddress : '',
                    createdAt : '',
                    updatedAt : ''
                };
                
            } else {                
                var employee = angular.copy($scope.employeeList[index]);
            }

            return employee;
        };

        $scope.setPage = function( page ){            

            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }

            // get pager object from service
            $scope.pager = pagerService.getPager($scope.dummyEmployeeList.length, page);

            // get current page of items
            $scope.employeeList = $scope.dummyEmployeeList.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
            
        };

        $scope.selectAllEmployees = function(){

            
            $scope.selectedAll = $scope.selectedAll ? true : false;

            angular.forEach($scope.employeeList, function( employee ){
                employee.selected = $scope.selectedAll;
            });
            
        };

        $scope.getEmployeeList = function() {

            activeRecordService.getActiveRecordList('employees/getEmployeeList').then(function( response ){

                if ( response.success ) {
                    $scope.employeeList = response.data;                    
                    $scope.dummyEmployeeList = response.data;                    
                    $scope.setPage(1);
                }
            });
        };      

        $scope.viewEmployeeDetails = function(index, empId) {

            $scope.$index = index;

            var modalInstance = $uibModal.open({
                animation : true,
                keyboard : false,
                backdrop : 'static',
                resolve : {
                    employeeInitialValues : function(){
                        return $scope.initEmployeeValues(true, $scope.$index);                        
                    },
                    getDepartmentList : function(){
                        return $scope.departmentList;
                    },
                    isEditMode : function(){
                        return false;
                    },
                    getEmployeeTimeRecord : function( activeRecordService ){
                        return activeRecordService.getActiveRecord({ id : empId }, 'employees/getEmployeeTimeRecord');
                    }
                },
                templateUrl : 'templates/employees/view.html',
                size : 'lg',
                controllerAs : 'vm',
                controller : function( $scope, employeeInitialValues, isEditMode, getDepartmentList, getEmployeeTimeRecord, $uibModal ){                    

                    $scope.editMode = isEditMode;
                    $scope.employee = employeeInitialValues;

                    $scope.departmentList = getDepartmentList;

                    $scope.employeeTimeRecords = getEmployeeTimeRecord.data;

                    $scope.modalOptions = {
                        headerText : 'View Employee Details',
                        closeButtonText : 'Cancel',
                        actionButtonText : 'Close',

                        ok : function( result ){
                            modalInstance.close();
                        },

                        close : function(){
                            modalInstance.dismiss('cancel');
                        }
                    };                   
                   
                }                
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
                    },
                    getRecordStatusArr : function(){
                        return $scope.recordStatusArr;
                    },
                    getDepartmentList : function(){
                        return $scope.departmentList;
                    },
                    getGenderArr : function(){
                        return $scope.genderArr;
                    }
                },                            
                templateUrl: 'templates/employees/employee-record-form.html', 
                windowTemplateUrl : 'templates/common/ui-modal.html',                
                size: 'md',
                controller: function( $scope, employeeInitialValues, isEditMode, getRecordStatusArr, getDepartmentList, getGenderArr ) {


                    $scope.employee = employeeInitialValues;
                    $scope.editMode = isEditMode;   

                    $scope.recordStatusArr = getRecordStatusArr;
                    $scope.departmentList = getDepartmentList;
                    $scope.genderArr = getGenderArr;
               
                    $scope.datePickerOptions = {                                                
                        // dateDisabled: disabled,  
                        dateHiredOptions : {
                            formatYear: 'yy',
                            startingDay: 1                            
                        }, 
                        dateRegularizedOptions : {
                            formatYear: 'yy',
                            startingDay: 1                            
                        },
                        formats : ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'],
                        altInputFormats : ['M!/d!/yyyy'],
                        openDateHired : function(){
                            $scope.datePickerOptions.isOpenDateHired.opened = true;                            
                        },
                        openDateRegularized : function(){
                            $scope.datePickerOptions.isOpenDateRegularized.opened = true;                            
                        },
                        isOpenDateHired : {
                            opened :false
                        },
                        isOpenDateRegularized : {
                            opened :false
                        }
                    };                  

                    $scope.datePickerOptions.formatSelected = $scope.datePickerOptions.formats[0];

                    // Disable weekend selection
                    function disabled(data) {
                        var date = data.date,
                          mode = data.mode;
                        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
                    }

                    $scope.employee.dateHired = new Date($scope.employee.dateHired);
                    $scope.employee.dateRegularized = new Date($scope.employee.dateRegularized);

                    $scope.datePickerOptions.dateRegularizedOptions.minDate = $scope.employee.dateHired;
                    
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

                            activeRecordService.saveActiveRecord($scope.employee, $scope.editMode, 'employees/saveEmployee').then(function( response ) {

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

                    $scope.getEmployeeList();        

                    $scope.addAlert('employeeListAlerts', {
                        type: 'success',
                        msg: 'Employee Details Successfully ' + ( isEditMode ? 'Updated' : 'Added' )
                    });                                                              
                }

            });

        };           

        /**
        * Fetches employee in search box via string
        **/
        $scope.searchEmployee = function( val ){

            return activeRecordService.getActiveRecord( { criteria : val }, 'employees/getEmployee');                

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
                controller: function($scope, $uibModalInstance, employeeDetails, index, activeRecordService) {                       

                    $scope.modalOptions = {
                        closeButtonText: 'Cancel',
                        headerText: 'Delete ' + (employeeDetails.fullName) + '?',
                        actionButtonText: 'Delete Employee details',
                        bodyText: 'Are you sure you want to delete employ ' + (employeeDetails.fullName)  + '\'s details?'
                    };

                    $scope.modalOptions.ok = function (result) {

                        var responseData;

                        activeRecordService.removeActiveRecord(employeeDetails.id, 'employees/removeEmployee').then(function(response) {

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
                    // $scope.getEmployeeList();

                    $scope.addAlert('employeeListAlerts', {
                        type: 'success',
                        msg: 'Employee Details Successfully Deleted'
                    });                    
                    
                }

            });
        };       

        $scope.saveTimeRecord = function(){

            var modalInstance = $uibModal.open({
                animation : true,
                size : 'md',
                templateUrl: 'templates/employees/time-record-form.html',          
                windowTemplateUrl : 'templates/common/ui-modal.html',
                controller : function(){
                    
                }
            });

        };

        $scope.getEmployeeList();

    }]);