
cereliApp
    .controller('employeeController', [ '$scope', '$uibModal', 'activeRecordService', 'pagerService', 'moment', 'calendarConfig', 'uibDateParser', 'getDepartmentList',  
        function( $scope, $uibModal, activeRecordService, pagerService, moment, calendarConfig, uibDateParser, getDepartmentList ){

        var _self = this;

        _self.employeeListAlerts = [];
        _self.employeeList = [];  
        $scope.departmentList = getDepartmentList.data; // get department lists        

        $scope.parentShowLoader = true;        

        _self.recordStatusArr = [ 
            {  name : 'Active', value : 1 },
            {  name : 'Inactive', value : 0}
        ];

        _self.genderArr = [
            { name : 'Male', value : 1 },
            { name : 'Female', value : 0}
        ];

        _self.dummyEmployeeList = [];  

        _self.pager = {};        

        _self.addAlert = function(type, options) {
            _self[type].push(options);
        };

        _self.closeAlert = function(type, index) {
            _self[type].splice(index, 1);
        };

        _self.initEmployeeValues = function( isEditMode, index){

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
                var employee = angular.copy(_self.employeeList[index]);
            }

            return employee;
        };

        _self.setPage = function( page ){            

            if (page < 1 || page > _self.pager.totalPages) {
                return;
            }

            // get pager object from service
            _self.pager = pagerService.getPager(_self.dummyEmployeeList.length, page);

            // get current page of items
            _self.employeeList = _self.dummyEmployeeList.slice(_self.pager.startIndex, _self.pager.endIndex + 1);
            
        };

        _self.selectAllEmployees = function(){

            
            _self.selectedAll = _self.selectedAll ? true : false;

            angular.forEach(_self.employeeList, function( employee ){
                employee.selected = _self.selectedAll;
            });
            
        };

        _self.getEmployeeList = function() {

            activeRecordService.getActiveRecordList('employees/getEmployeeList').then(function( response ){

                if ( response.success ) {
                    _self.employeeList = response.data;                    
                    _self.dummyEmployeeList = response.data;                    
                    _self.setPage(1);
                    $scope.parentShowLoader = false;   
                }
            });
        };      

        _self.viewEmployeeDetails = function(index, empId) {

            _self.$index = index;
            $scope.parentShowLoader = true;            

            var modalInstance = $uibModal.open({
                animation : true,
                keyboard : false,
                backdrop : 'static',
                resolve : {                   
                    employeeInitialValues : function(){
                        return _self.initEmployeeValues(true, _self.$index);                        
                    },
                    getDepartmentList : function(){
                        return $scope.departmentList;
                    },
                    isEditMode : function(){
                        return false;
                    },
                    getEmployeeTimeRecord : function( activeRecordService ){

                        $scope.childShowLoader = true;

                        return activeRecordService.getActiveRecord({ id : empId }, 'employees/getEmployeeTimeRecord');
                    }
                },
                
                templateUrl : 'templates/employees/view.html',
                
                size : 'lg',          

                bindToController : true,

                controller : function( $scope, employeeInitialValues, isEditMode, getDepartmentList, getEmployeeTimeRecord, $uibModal ){                                        

                    var _self = this;                 

                    $scope.editMode = isEditMode;
                    $scope.employee = employeeInitialValues;                    
               
                    $scope.departmentList = getDepartmentList; 
                    $scope.employeeTimeRecords = getEmployeeTimeRecord.data;

                    $scope.modalOptions = {
                        headerText : 'View Employee Details',
                        closeButtonText : 'Cancel',
                        actionButtonText : 'Close',

                        close : function(){                                                    
                            modalInstance.close();                            
                        }                        
                    };                   
                   
                },

                controllerAs : 'viewEmployeeDetailsCtrl'
            });

            modalInstance.closed.then(function( responseData ){
               $scope.parentShowLoader = false;
            });

        };
        
        
        _self.saveEmployee = function( index, isEditMode ) {

            $scope.editMode = isEditMode;
            $scope.index = index;

            if ( $scope.editMode ) $scope.parentShowLoader = true;            

            var modalInstance = $uibModal.open({
                animation: true,
                keyboard : false,
                resolve : {
                    employeeInitialValues : function() {
                        return _self.initEmployeeValues($scope.editMode, $scope.index);
                    },
                    isEditMode : function(){
                        return $scope.editMode;
                    },
                    getRecordStatusArr : function(){
                        return _self.recordStatusArr;
                    },
                    getDepartmentList : function(){
                        return $scope.departmentList;
                    },
                    getGenderArr : function(){
                        return _self.genderArr;
                    }
                },                            
                templateUrl: 'templates/employees/employee-record-form.html', 
                windowTemplateUrl : 'templates/common/ui-modal.html',                
                size: 'lg',
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

            modalInstance.closed.then(function( responseData ){
                $scope.parentShowLoader = false;  
            });

            modalInstance.result.then(function( responseData ){

                if ( responseData.success ) {

                    _self.getEmployeeList();        

                    _self.addAlert('employeeListAlerts', {
                        type: 'success',
                        msg: 'Employee Details Successfully ' + ( isEditMode ? 'Updated' : 'Added' )
                    });                                                              
                }

            });

        };           

        /**
        * Fetches employee in search box via string
        **/
        _self.searchEmployee = function( val ){

            return activeRecordService.getActiveRecord( { criteria : val }, 'employees/getEmployee');                

        };

        /**
        * Removes/Deletes employee by id        
        **/
        _self.removeEmployee = function( id, index ) {

            $scope.parentShowLoader = true;  

            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: false,
                backdrop: 'static',                    
                templateUrl: 'templates/common/modal.html',          
                windowTemplateUrl : 'templates/common/ui-modal.html',
                resolve: {                       
                    employeeDetails: function() {
                        return _self.employeeList[index];
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
                        modalInstance.dismiss('cancel');
                    };

                }
            });

            modalInstance.closed.then(function( responseData ){
                $scope.parentShowLoader = false;  
            });

            modalInstance.result.then(function(responseData) {

                $scope.parentShowLoader = false;  

                if ( responseData.success ) {

                    _self.employeeList.splice(index, 1);                    

                    _self.addAlert('employeeListAlerts', {
                        type: 'success',
                        msg: 'Employee Details Successfully Deleted'
                    });                    
                    
                }

            });
        };               

        _self.getEmployeeList();

    }]);