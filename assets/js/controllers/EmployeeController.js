(function(){

    'use strict';

    var employeeController = function( $scope, $uibModal, ActiveRecordFactory, PagerService, 
        moment, calendarConfig, uibDateParser, getDepartmentList ){

        var _self = this;

        _self.employeeListAlerts = [];
        
        $scope.mainDataList = [];  
        $scope.activities = [];
        $scope.departmentList = getDepartmentList.data; // get department lists            
        $scope.calendarTrackerOptions = {
            minDate: new Date()        
        };

        $scope.config = {
            showBulkActionsContent : false,
            showFilterOptionsContent : false,
            showEmployeeDetailsContent : false,
            selectedViewEmployeeDetails : {
                employee : {}
            },
            childTab : {}
        };     

        $scope.$watch('mainDataList', function( newValue ){            
            $scope.mainDataList = newValue;            
            _self.selectedEditEmployees = newValue.filter(_self.filterSelectedEmployees);
        }, true);      

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

        $scope.addAlert = function(type, options) {
            _self[type].push(options);
        };

        $scope.filterItem = function( newItem ){
            $scope.filterBy = newItem;
        };

        $scope.closeAlert = function(type, index) {
            _self[type].splice(index, 1);
        };

        _self.showBulkActions = function( type ){     

            if ( type == 1 ) {
                $scope.bulkActionType = 'Edit';
            } else if ( type == 2 ) {
                $scope.bulkActionType = 'Export';
            } else if( type == 0 ){
                $scope.bulkActionType = 'Remove';
            }

            _self.selectedEditEmployees = angular.copy($scope.mainDataList).filter(_self.filterSelectedEmployees);
            
            $scope.config.showBulkActionsContent = true;            
        };

        /**
        * Filters the selected employee lists via selected attribute/property
        **/
        _self.filterSelectedEmployees = function( obj ){                     
            return obj.hasOwnProperty('selected') && obj.selected == true ? true : false;            
        }

        _self.showFilterOptions = function( type ){                       
            $scope.config.showFilterOptionsContent = true;            
        };

        _self.tableHeaders = [
            { name : 'empId', label : 'Employee ID' },
            { name : 'fullName', label : 'Full Name' },
            { name : 'departmentAssigned', label : 'Department Assigned' },
            { name : 'position', label : 'Position' },
            { name : 'recordStatus', label : 'Record Status' },
        ];

        _self.initEmployeeValues = function( isEditMode, index){

            if ( !isEditMode && index == 0 ) {
                var employee = {
                    id : 0,
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
                    contactNumber : '',
                    gender : '',
                    homeAddress : '',
                    emailAddress : '',
                    createdAt : '',
                    updatedAt : ''
                };
                
            } else {                
                var employee = angular.copy($scope.mainDataList[index]);
            }

            return employee;
        };

        _self.setPage = function( page ){            

            if (page < 1 || page > _self.pager.totalPages) {
                return;
            }

            // new pager
            var pagerInstance = new PagerService(_self.dummyEmployeeList.length, 10);

            _self.pager = pagerInstance.getPager(page);

            // get current page of items
            $scope.mainDataList = _self.dummyEmployeeList.slice(_self.pager.startIndex, _self.pager.endIndex + 1);
            
        };

        _self.selectAllEmployees = function(){            

            angular.forEach($scope.mainDataList, function( employee ){
                employee.selected = _self.selectedAll;
            });
            
        };

        $scope.getEmployeeList = function() {

            $scope.parentShowLoader = true;

            _self.getEmployeeActivities(0);

            ActiveRecordFactory.getActiveRecordList('employees/getEmployeeList').then(function( response ){

                if ( response.success ) {               

                    $scope.mainDataList = response.data;                    
                    
                    _self.dummyEmployeeList = response.data;                    

                    _self.setPage(1);

                    $scope.parentShowLoader = false;   
                }
            });
        };     

        _self.viewEmployeeDetailsContent = function( index, empId, childTab ){

            ActiveRecordFactory.getActiveRecord({ id : empId }, 'employees/getEmployeeTimeRecord').then(function( response ){
                if ( response.success ) {

                    $scope.config.showEmployeeDetailsContent = true;

                    $scope.config.selectedViewEmployeeDetails.index = index;
                    $scope.config.selectedViewEmployeeDetails.employee = _self.initEmployeeValues(true, index);                    
                    $scope.config.selectedViewEmployeeDetails.time_records = response.data;                    

                    $scope.config.active = 2;

                    $scope.config.childTab.active = childTab;
                }
            });

        };          

        _self.getEmployeeActivities = function( getAll ){
            
            $scope.childShowLoader = true;

            ActiveRecordFactory.getActiveRecord({ lastActivityRecord : getAll }, 'employee_activities/getAllEmployeeActivities').then(function( response ){
                if ( response.success) {
                    $scope.childShowLoader = false;   

                    if ( getAll == 0 ) { 
                        $scope.timeRecordActivities = response.data;  
                    } else {
                        $scope.activities = response.data;                      
                        $scope.lastActivityRecord = response.data.length ? $scope.activities[$scope.activities.length-1].dateCommitted : moment().format('YYYY-MM-DD');                                    
                    } 

                }
            });
        };
        
        
        _self.saveEmployee = function( index, isEditMode ) {

            $scope.editMode = isEditMode;
            $scope.index = index;            

            if ( $scope.editMode ) $scope.parentShowLoader = true;            

            var modalInstance = $uibModal.open({
                animation: true,
                keyboard : false,
                backdrop : false,
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

                    delete $scope.employee.time_records;
               
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

                            $scope.childShowLoader = true;

                            var responseData, id;                                                   

                            ActiveRecordFactory.saveActiveRecord($scope.employee, $scope.editMode, 'employees/saveEmployee').then(function( response ) {
                                responseData = response;

                                if ( responseData.success ) {
                                    modalInstance.close(responseData);                                    
                                } else {

                                    $scope.addAlert('employeeListAlerts', {
                                        type: 'danger',
                                        msg: 'Employee Details Successfully Deleted'
                                    });     

                                }
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

                    $scope.getEmployeeList();        

                    $scope.addAlert('employeeListAlerts', {
                        type: 'success',
                        msg: 'Employee Details Successfully ' + ( isEditMode ? 'Updated' : 'Added' )
                    });                                                              
                }

            });

        };      

        _self.getTimeRecordList = function(){

            $scope.childShowLoader = true;

            ActiveRecordFactory.getActiveRecordList('employees/getTimeRecordList').then(function( response ){
               
                $scope.childShowLoader = false;
                
                _self.timeRecordList = response.data;
            });
        };    

        _self.bulkNewBulkEmployees = function(){

            var isEditMode = false;

            var modalInstance = $uibModal.open({
                templateUrl : "templates/employees/employee-add-bulk-dummy-records.html",
                animation: true,
                keyboard: false,
                backdrop: false,
                size: 'md',

                resolve : {
                    initEmployeeValues : function(){
                        return _self.initEmployeeValues(0, 0);
                    }
                },

                controller : function( $scope, initEmployeeValues ){

                    var _self = this;

                    $scope.dummyRecord = {
                        empIds : null,
                        dataAttrs : initEmployeeValues,
                        userId : $scope.authorizeUser.user.id
                    };  

                    $scope.dummyRecord.dataAttrs.gender = 0;
                    $scope.dummyRecord.dataAttrs.departmentAssigned = 0;
                    $scope.dummyRecord.dataAttrs.fullName = "Dummy Name";

                    $scope.modalOptions = {
                        headerText : "New Bulk Employees",
                        closeButtonText : "Cancel",
                        actionButtonText : "Save",

                        ok : function(result){

                            _self.showLoader = true;

                            var responseData, id;                                               

                            ActiveRecordFactory.getActiveRecord($scope.dummyRecord, 'employees/saveBulkEmployees').then(function( response ) {
                                responseData = response;

                                if ( responseData.success ) {
                                    modalInstance.close(responseData);                                    
                                } else {

                                    $scope.addAlert('employeeListAlerts', {
                                        type: 'danger',
                                        msg: 'Employee data list saving occurred.'
                                    });     

                                }
                            });


                        },

                        close : function(){
                            modalInstance.dismiss('cancel');
                        }
                    } 

                },

                controllerAs : 'vm'  

            });


            // modalInstance.closed.then(function( responseData ){
            //     $scope.parentShowLoader = false;  
            // });

            modalInstance.result.then(function( responseData ){

                if ( responseData.success ) {

                    $scope.getEmployeeList();        

                    $scope.addAlert('employeeListAlerts', {
                        type: 'success',
                        msg: 'Dummy Employee Records Successfully ' + ( isEditMode ? 'Updated' : 'Added' )
                    });                                                              
                }

            });

        };

        /**
        * Selects employee in search box via string
        **/
        _self.selectedSearchEmployee = function( data ){             
            $scope.mainDataList = [data.originalObject];       
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
                        return $scope.mainDataList[index];
                    },
                    index: function() {
                        return index;
                    }
                },
                size: 'sm',
                controller: function($scope, $uibModalInstance, employeeDetails, index, ActiveRecordFactory) {                       

                    $scope.modalOptions = {
                        closeButtonText: 'Cancel',
                        headerText: 'Delete ' + (employeeDetails.fullName) + '?',
                        actionButtonText: 'Delete Employee details',
                        bodyText: 'Are you sure you want to delete ' + (employeeDetails.fullName)  + '\'s details?'
                    };

                    $scope.modalOptions.ok = function (result) {

                        var responseData;

                        ActiveRecordFactory.removeActiveRecord( { id : employeeDetails.id, fullName : employeeDetails.fullName, empId : employeeDetails.empId }, 'employees/removeEmployee').then(function(response) {                            
                                responseData = response;                                                                
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

                    $scope.mainDataList.splice(index, 1);                    

                    $scope.addAlert('employeeListAlerts', {
                        type: 'success',
                        msg: 'Employee Details Successfully Deleted'
                    });                    
                    
                }

            });
        };               

        $scope.getEmployeeList();       

    };

    angular.module('cereliApp').controller('employeeController', employeeController);

    employeeController.$inject = [ '$scope', '$uibModal', 'ActiveRecordFactory', 'PagerService', 
    'moment', 'calendarConfig', 'uibDateParser', 'getDepartmentList' ];


})();


