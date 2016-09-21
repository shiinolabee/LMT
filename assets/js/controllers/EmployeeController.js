
var employeeController = function( $scope, $uibModal, activeRecordService, pagerService, 
        moment, calendarConfig, uibDateParser, getDepartmentList ){

    var _self = this;

    _self.employeeListAlerts = [];
    
    $scope.mainDataList = [];  
    $scope.activities = [];
    $scope.departmentList = getDepartmentList.data; // get department lists            

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

    $scope.closeAlert = function(type, index) {
        _self[type].splice(index, 1);
    };

    _self.tableHeaders = [
        { name : 'empId', label : 'Employee ID' },
        { name : 'fullName', label : 'Full Name' },
        { name : 'departmentAssigned', label : 'Department Assigned' },
        { name : 'position', label : 'Position' },
        { name : 'dateHired', label : 'Date Hired' },
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

        // get pager object from service
        _self.pager = pagerService.getPager(_self.dummyEmployeeList.length, page);

        // get current page of items
        $scope.mainDataList = _self.dummyEmployeeList.slice(_self.pager.startIndex, _self.pager.endIndex + 1);
        
    };

    _self.selectAllEmployees = function(){

        
        _self.selectedAll = _self.selectedAll ? true : false;

        angular.forEach($scope.mainDataList, function( employee ){
            employee.selected = _self.selectedAll;
        });
        
    };

    _self.getEmployeeList = function() {

        $scope.parentShowLoader = true;

        activeRecordService.getActiveRecordList('employees/getEmployeeList').then(function( response ){

            if ( response.success ) {               

                $scope.mainDataList = response.data;                    
                
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

                _self.getStatisticsReport = function(){
                    $scope.childShowLoader = true;

                    activeRecordService.getActiveRecord({ id : $scope.employee.empId }, 'employees/getEmployeeStatisticsReport').then(function( response ){
                        if ( response.success ) {                                
                            $scope.statisticsRecordResult = response.data;
                            $scope.childShowLoader = false;                                
                        } 
                    });
                };   

                _self.getEmployeeEventCalendar = function(){
                    $scope.childShowLoader = true;

                    activeRecordService.getActiveRecord({ id : empId }, 'employees/getEmployeeEventCalendar').then(function( response ){
                        if ( response.success ) {                                
                            $scope.employeeEventCalendarRecords = response.data;
                            $scope.childShowLoader = false;                                
                        } 
                    });
                };

                _self.getDailyTimeRecordCalendar = function(){
                    $scope.childShowLoader = true;

                    activeRecordService.getActiveRecord({ id : empId }, 'employees/getEmployeeTimeRecord').then(function( response ){
                        if ( response.success ) {                                
                            $scope.employeeTimeRecords = response.data;
                            $scope.childShowLoader = false;                                
                        } 
                    });
                };       


                _self.getTrackingActivities = function(){
                    $scope.childShowLoader = true;

                    activeRecordService.getActiveRecord({ id : empId }, 'employee_activities/getEmployeeActivities').then(function( response ){
                        if ( response.success) {
                            $scope.activities = response.data;
                            $scope.childShowLoader = false;                                
                        }
                    });

                };        
               
            },

            controllerAs : 'viewEmployeeDetailsCtrl'
        });

        modalInstance.closed.then(function( responseData ){
           $scope.parentShowLoader = false;
        });

    };

    _self.getAllEmployeeActivities = function(){
        
        $scope.childShowLoader = true;

        activeRecordService.getActiveRecordList('employee_activities/getAllEmployeeActivities').then(function( response ){
            if ( response.success) {
                $scope.childShowLoader = false;                                
                $scope.activities = response.data              
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

                        activeRecordService.saveActiveRecord($scope.employee, $scope.editMode, 'employees/saveEmployee').then(function( response ) {
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

                _self.getEmployeeList();        

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
    _self.searchEmployee = function( val ){

        return activeRecordService.getActiveRecord( { criteria : val }, 'employees/getEmployee');                

    };

    /**
    * Add New Employee Time Record
    **/
    _self.saveTimeRecord = function(){

         var modalInstance = $uibModal.open({
            animation: true,
            keyboard: false,
            backdrop: 'static',                    
            templateUrl: 'templates/employees/time-record-form.html',                
            size: 'md',
            controller: function($scope, activeRecordService) {                       

                $scope.modalOptions = {
                    closeButtonText: 'Cancel',
                    headerText: 'Add New Time Record',
                    actionButtonText: 'Save'                        
                };

                $scope.modalOptions.ok = function (result) {

                    var responseData;

                    activeRecordService.saveActiveRecord($scope.time_record, false, 'employee_time_records/saveEmployeeTimeRecord').then(function(response) {                            
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

        modalInstance.result.then(function( response ){
            if ( response.success ) {
                $scope.addAlert('employeeListAlerts', {
                    type: 'success',
                    msg: 'Employee Time Record Details Successfully Saved.'
                });                    
                
            }
        })
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

    _self.getEmployeeList();

};

cereliApp.controller('employeeController', employeeController);

employeeController.$inject = [ '$scope', '$uibModal', 'activeRecordService', 'pagerService', 
    'moment', 'calendarConfig', 'uibDateParser', 'getDepartmentList' ];

