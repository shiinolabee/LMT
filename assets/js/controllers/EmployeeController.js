
cereliApp
    .controller('employeeController', [ '$scope', '$uibModal', 'activeRecordService', 'pagerService', 'moment', 'calendarConfig', 'Upload',  
        function( $scope, $uibModal, activeRecordService, pagerService, moment, calendarConfig, Upload ){

        $scope.employeeListAlerts = [];
        $scope.employeeList = [];  

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
            
        }

        $scope.getEmployeeList = function() {

            activeRecordService.getActiveRecordList('employees/getEmployeeList').then(function( response ){

                if ( response.success ) {
                    $scope.employeeList = response.data;                    
                    $scope.dummyEmployeeList = response.data;                    
                    $scope.setPage(1);
                }
            });
        };        

        $scope.getDepartmentList = function(){

            activeRecordService.getActiveRecordList('departments/getDepartmentList').then(function( response ){

                if ( response.success ) {
                    $scope.departmentList = response.data;                                                            
                }
            });

            $scope.getEmployeeList();

        };  

        $scope.viewEmployeeDetails = function(index) {

            $scope.$index = index;

            var modalInstance = $uibModal.open({
                animation : true,
                keyboard : false,
                resolve : {
                    employeeInitialValues : function(){
                        return $scope.initEmployeeValues(true, $scope.$index);                        
                    },
                    getDepartmentList : function(){
                        return $scope.departmentList;
                    },
                    isEditMode : function(){
                        return false;
                    }
                },
                templateUrl : 'templates/employees/view.html',
                size : 'lg',
                controller : function( $scope, employeeInitialValues, isEditMode, getDepartmentList ){

                    $scope.editMode = isEditMode;
                    $scope.employee = employeeInitialValues;
                    $scope.departmentList = getDepartmentList;

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

                    //Daily Time Record 
                    $scope.calendarView = 'month';           
                    $scope.calendarDate = new Date();     
                    $scope.calendarTitle = "Daily Time Record";

                    var actions = [{
                      label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
                      onClick: function(args) {
                        // alert.show('Edited', args.calendarEvent);
                      }
                    }, {
                      label: '<i class=\'glyphicon glyphicon-remove\'></i>',
                      onClick: function(args) {
                        // alert.show('Deleted', args.calendarEvent);
                      }
                    }];

                    $scope.addEvent = function(){
                        $scope.events.push({
                            title: 'New event',
                            startsAt: moment().startOf('day').toDate(),
                            endsAt: moment().endOf('day').toDate(),
                            color: calendarConfig.colorTypes.important,
                            draggable: true,
                            resizable: true
                        });
                    }      

                    $scope.eventClicked = function(event) {
                      // alert.show('Clicked', event);
                    };

                    $scope.eventEdited = function(event) {
                      // alert.show('Edited', event);
                    };

                    $scope.eventDeleted = function(event) {
                      // alert.show('Deleted', event);
                    };

                    $scope.eventTimesChanged = function(event) {
                      // alert.show('Dropped or resized', event);
                    };

                    $scope.toggle = function($event, field, event) {
                      $event.preventDefault();
                      $event.stopPropagation();
                      event[field] = !event[field];
                    };

                    $scope.events = [
                      {
                        title: 'An event',
                        color: calendarConfig.colorTypes.warning,
                        startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
                        endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
                        draggable: true,
                        resizable: true,
                        actions: actions
                      }, {
                        title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
                        color: calendarConfig.colorTypes.info,
                        startsAt: moment().subtract(1, 'day').toDate(),
                        endsAt: moment().add(5, 'days').toDate(),
                        draggable: true,
                        resizable: true,
                        actions: actions
                      }, {
                        title: 'This is a really long event title that occurs on every year',
                        color: calendarConfig.colorTypes.important,
                        startsAt: moment().startOf('day').add(7, 'hours').toDate(),
                        endsAt: moment().startOf('day').add(19, 'hours').toDate(),
                        recursOn: 'year',
                        draggable: true,
                        resizable: true,
                        actions: actions
                      }
                    ];

                }                
            });
        }      
        

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
                templateUrl: 'templates/employees/form.html', 
                windowTemplateUrl : 'templates/common/ui-modal.html',                
                size: 'md',
                controller: function( $scope, employeeInitialValues, isEditMode, getRecordStatusArr, getDepartmentList, getGenderArr ) {


                    $scope.employee = employeeInitialValues;
                    $scope.editMode = isEditMode;                    
                    $scope.recordStatusArr = getRecordStatusArr;
                    $scope.departmentList = getDepartmentList;
                    $scope.genderArr = getGenderArr;

                    console.log($scope.employee);
                    
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
        * Checks employee id exists in collection
        **/
        $scope.checkEmpIdExists = function( val ){

        };


        /**
        * Fetches employee in search box via string
        **/
        $scope.searchEmployee = function( val ){

            return activeRecordService.getActiveRecord( val, 'employees/getEmployee?criteria=');                

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
                    $scope.getEmployeeList();

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
                controller: function($scope, $uibModalInstance, activeRecordService) {                       

                    $scope.modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Import & Save',
                        headerText: 'Import Employee Time Records',                        
                    };

                    $scope.upload - function( file ){
                        // Upload.upload({})
                    };

                    $scope.modalOptions.ok = function (result) {

                        var responseData;

                        // activeRecordService.saveImportedTimeRecords().then(function(response) {

                        //     if ( response.success ) {
                        //         responseData = response;                                    
                        //     }
                        // }, function() {
                        //     responseData = {
                        //         success: false,
                        //         errors: ['Unknown error occured while deleting client note']
                        //     };

                        // }).finally(function(){
                        //     modalInstance.close(responseData);                                
                        // });                      
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
                size : 'md',
                templateUrl: 'templates/employees/time-record-form.html',          
                windowTemplateUrl : 'templates/common/ui-modal.html',
                controller : function(){
                    
                }
            });

        };

        $scope.getDepartmentList();       

    }]);