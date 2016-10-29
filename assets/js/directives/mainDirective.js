(function(){

	'use strict';

	var cereliDirectives = angular.module('cereliDirectives', [ 'ngFileUpload' ] );	

	cereliDirectives.filter('getRenderedHours', function(){

		return function( value ) {

			if ( value.length > 1 ) {
				var totalHours = Math.abs( value[0].startsAt - value[value.length-1].startsAt  ) / 36e5;
			} else if ( value.length == 1 ) {
				var totalHours = Math.abs( value[0].startsAt - value[0].endsAt  ) / 36e5;
			}

			return totalHours.toFixed(2) + ' hr(s)';
		}

	})

	cereliDirectives.filter('contentIsEmpty', function(){

		return function( value ) {
			if ( !value ) {
				return 'Not specified.';
			}

			return value;
		}
	});

	cereliDirectives.filter('filterGender', function(){

		return function( value ) {
			if ( !value ) {
				return 'Female';
			}

			return 'Male';
		}
	});

	cereliDirectives.filter('recordStatus', function(){

		return function( value ) {
			if ( value == 0 ) {
				return 'Inactive';
			} else if ( value == 1 ) {
				return 'Active';
			}
		}
	});

	cereliDirectives.filter('dayEventFilter', function(){

		return function( value ) {

			if ( value.length > 1 ) {
				return value[value.length-1].startsAt;
			} else if ( value.length == 1 ) {
				return value[0].endsAt;
			}

		}

	});

	cereliDirectives.directive('employeeFilterOptions', function(){

		return {
			
			restrict : 'E',

			transclude : true,

			templateUrl : 'templates/employees/employee-filter-options.html',

			scope : true,

			bindToController : {
				departmentList : '=',
				employeeList : '='
			},

			controller : [ '$scope' , function( $scope ){
				var _self = this;

				_self.dummyList = [];
				_self.selectedDepartmentId = 0;

				$scope.$watch(function(){
					return _self.employeeList;
				}, function( newValue ){
					console.log(newValue)
					_self.employeeList = newValue;
				});

				_self.close = function(){									
					$scope.$parent.$parent.config.showFilterOptionsContent = false;	
				};

				_self.check = function( obj ){					

					if ( obj.departmentAssigned == _self.selectedDepartmentId ) {
						_self.dummyList.push(obj);
					}

					return obj.departmentAssigned == _self.selectedDepartmentId ? false : true;
				};

				_self.toggleFilter = function( departmentId ){

					console.log(_self.selectedDepartmentId, departmentId);

					if ( _self.selectedDepartmentId !== 0 )  {
						if ( _self.selectedDepartmentId == departmentId ) {
							_self.selectedDepartmentId = departmentId;
							$scope.$parent.$parent.mainDataList = $scope.$parent.$parent.mainDataList.concat(_self.dummyList);					 
						} else {
							_self.selectedDepartmentId = departmentId;

							var employeeList = angular.copy(_self.employeeList).filter(_self.check);									

							$scope.$parent.$parent.mainDataList = employeeList;									
						}

					} else {

						_self.selectedDepartmentId = departmentId;

						var employeeList = angular.copy(_self.employeeList).filter(_self.check);									

						$scope.$parent.$parent.mainDataList = employeeList;											
					}


						
				};
			}],

			controllerAs : 'vm'
		};

	});

	cereliDirectives.directive('employeeViewDetails', [ '$uibModal', function( $uibModal ){

		return {

			restrict : 'E',

			transclude : true,

			templateUrl : 'templates/employees/employee-view-details.html',

			scope : true,

			bindToController : {
				departmentList : '=',
				employee : '=',
				employeeTimeRecords : '=',
				index : "=",
				childTabActive : '='
			},

			controllerAs : 'vm',

			controller : [ '$scope', 'ActiveRecordFactory', function( $scope, ActiveRecordFactory ){

				var _self = this;
			   	
                $scope.hasSelectedOtherTab = false;
                $scope.statisticsRecordResult = [];   


                $scope.$watchCollection(function(){
                	return [ _self.employeeTimeRecords, _self.employee];
                }, function( newValue ){
                	$scope.employeeTimeRecords = newValue[0];
                	$scope.employee = newValue[1];
                });

                _self.close = function(){
                	$scope.$parent.$parent.config.showEmployeeDetailsContent = false;
                	$scope.$parent.$parent.config.active = 1;
                };

                _self.sendPrivateEmail = function(){

                    var innerModalInstance = $uibModal.open({
                        animation : true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        keyboard : false,
                        backdrop : 'static',
                        templateUrl : 'templates/common/create-email.html',
                        size : 'md'
                    });
                };

                _self.generateDTRFile = function( empId ){

                	var innerModalInstance = $uibModal.open({
                        animation : true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        keyboard : false,
                        backdrop : 'static',
                        resolve : {
                        	getEmployeeId : function(){
                        		return empId;
                        	}
                        },
                        templateUrl : 'templates/employees/employee-choose-dtr-month.html',
                        size : 'lg',
                        bindToController : true,
                        controllerAs : 'vm',
                        controller : [ '$scope', 'getEmployeeId', 'ActiveRecordFactory', function( $scope, getEmployeeId, ActiveRecordFactory ){

                        	var _self = this;
                			
                			_self.time_record_datePicker = {};	

                			_self.exportType = 0; // set to .pdf file type
                			_self.time_record_dp_options = {
			                	startsAt : {
			                		formatYear: 'yy',
			                    	startingDay: 1                    		
			                	},
			                	endsAt : {
			                		formatYear: 'yy',
			                        startingDay: 1    
			                	}
			                };

                    	   	/**
							* Toggles event for the date picker pop-up
							**/
							_self.toggle = function($event, field, event) {
						      	$event.preventDefault();
						      	$event.stopPropagation();
						      	event[field] = !event[field];
						    };

						    _self.onChangeStartsAt = function(){			    	
						    	_self.time_record_dp_options.endsAt.minDate = _self.exportDate.startsAt;
						    };

						    _self.generateReport = function(){

						    	// console.log(_self.exportDate);

						    	if ( _self.exportDate ) {

						    		_self.showLoader = true;

						    		ActiveRecordFactory.getActiveRecord({ id : getEmployeeId, dates : _self.exportDate }, 'employee_time_records/getTimeRecordsByDates')
						    		.then(function(response){
						    			if ( response.success ) {

						    			}

						    			_self.showLoader = false;
						    		});

						    	}
						    };

                        	$scope.modalOptions = {
                        		headerText : "Generate DTR Report for Employee " + getEmployeeId,
                        		// actionButtonText : "Generate DTR Report",
                        		closeButtonText : "Cancel",

                        		ok : function(){

                        		},

                        		close : function(){
                        			innerModalInstance.dismiss('cancel');
                        		}
                        	};
                        }]
                    });
                };             

                _self.getStatisticsReport = function(){
                    $scope.childShowLoader = true;

                    $scope.initDate = moment();

                    $scope.selectedYear = $scope.initDate.format('YYYY');
                    $scope.selectedMonth = $scope.initDate.format('MMMM');                    

                    ActiveRecordFactory.getActiveRecord({ id : _self.employee.empId, date : $scope.initDate.format('YYYY-MM-DD') }, 'employee_time_records/getTimeRecordsByDates').then(function( response ){
                        if ( response.success ) {                                
                            $scope.statisticsRecordResult = response.data;
                            $scope.childShowLoader = false;                                
                        } 
                    });
                };
         
                _self.getDailyTimeRecordCalendar = function(){    

                    if( $scope.hasSelectedOtherTab ) {

                        $scope.childShowLoader = true;

                        ActiveRecordFactory.getActiveRecord({ id : _self.employee.empId }, 'employees/getEmployeeTimeRecord').then(function( response ){
                            if ( response.success ) {                                
                                $scope.employeeTimeRecords = response.data;
                                $scope.childShowLoader = false;                                
                            } 
                        });                      

                    }  
                };     

                _self.getTrackingActivities = function(){

                    $scope.hasSelectedOtherTab = true;
                    $scope.childShowLoader = true;

                    ActiveRecordFactory.getActiveRecord({ id : _self.employee.id }, 'employee_activities/getEmployeeActivities').then(function( response ){
                        if ( response.success) {
                            $scope.activities = response.data;
                            $scope.childShowLoader = false;                                
                        }
                    });

                };                 
			}]
		}

	}]);

	cereliDirectives.directive('employeeProfileInformation', function( moment ){

		return {

			restrict : 'E',

			transclude : true,

			templateUrl : 'templates/employees/employee-profile-information.html',

			scope : true,

			bindToController :{
				employee : '=',
				employeeTimeRecords : '='
			},

			controllerAs : 'vm',

			controller : [ '$scope', 'ActiveRecordFactory', function( $scope, ActiveRecordFactory ){

				var _self = this;

				_self.alerts = [];
            	_self.formCopyEmployeeDetails = angular.copy(_self.employee);

				$scope.$watch(function(){
                	return _self.employee;
                }, function( newValue ){                        	
                	_self.employee = newValue;      	
            	 	_self.employee.dateHired = new Date(_self.employee.dateHired);
                    _self.employee.dateRegularized = new Date(_self.employee.dateRegularized);
            		_self.formCopyEmployeeDetails = angular.copy(_self.employee);
                });

              	$scope.addAlert = function(type, options) {
		            _self[type].push(options);
		        };		        

		        $scope.closeAlert = function(type, index) {
		            _self[type].splice(index, 1);
		        };

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
	                altInputFormats : ['M!/d!/yyyy', 'MMM dd yyyy'],
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

				_self.genderArr = [
		            { name : 'Male', value : 1 },
		            { name : 'Female', value : 0}
		        ];	         	

		        _self.saveEmployeeDetails = function(){

	        		var formCopyEmployeeDetails = _self.formCopyEmployeeDetails;		        		

		        	delete _self.formCopyEmployeeDetails.time_records;		

		        	// console.log(formCopyEmployeeDetails);

		        	if ( formCopyEmployeeDetails ) {

		        		_self.childShowLoader = true;

		        		ActiveRecordFactory.saveActiveRecord(formCopyEmployeeDetails, true, 'employees/saveEmployee').then(function( response ) {	        			

		        			_self.childShowLoader = false;

		        			if( response.success ) {

		        				$scope.addAlert('alerts', {
		        					type : 'success',
		        					msg  : 'Employee Details Successfully Updated.'
		        				});

		        				_self.isToggleInput = false;		        					        			        				

		        				_self.employee = response.data[0];
		        			}
                        });
		        	}
		        }

			}]
		}

	});

	cereliDirectives.directive('employeeBulkActions', function(){

		return {

			restrict : 'E',

			transclude : true,

			templateUrl : 'templates/employees/employee-bulk-actions.html',

			scope : true,

			bindToController : {
				departmentList : '=',
				selectedEmployees : '=',
				bulkType : '=',
				authorizeUserId : '='
			},

			controller : ['$scope', 'ActiveRecordFactory', function( $scope, ActiveRecordFactory ){

				var _self = this;		
				
				_self.selectedEmployees = angular.copy(_self.selectedEmployees);									

				_self.recordStatus = null; // sets record status model
				_self.selectedEmployeeIds = []; // selected ids array container

                _self.time_record_datePicker = {};	
                _self.exportType = 2; // set to .doc file type

				_self.removeFromBulkItems = function( index ) {
					console.log(_self.selectedEmployees, index);
					_self.selectedEmployees.splice(index, 1);  
					console.log(_self.selectedEmployees);
				};		

				/**
		        * Selects employee in search box via string
		        **/
		        _self.selectedSearchEmployee = function( data ){  
		        	
		        	data.originalObject.selected = true;
		            _self.selectedEmployees.push(data.originalObject);       		        	
		        };

		        /**
		        * Removes unneeded employee attributes/properties for updating 		        
		        **/
		        _self.removeUnnecessaryObjectProperties = function( dataList ){

		        	angular.forEach(dataList, function( item, key ){
		        		Object.keys(item).forEach(function( prop ){		        			
		        			if ( prop !== 'id' && prop !== 'departmentAssigned' && prop !== 'recordStatus') {
		        				delete item[prop];
		        			}
		        		});		        		
		        	});

		        };

		        /**
		        * Filters the selected employee lists via selected attribute/property
		        **/
		        _self.filterPropertiesOfSelectedEmployees = function( obj ){

		        	var id = obj.id;

                    delete obj.id;                                                       
		        		
	        		_self.selectedEmployeeIds.push(id);

	        		obj.departmentAssigned = _self.departmentAssigned;
	        		obj.recordStatus = _self.recordStatus !== null ? parseInt(_self.recordStatus) : 1;	        	

                	return true;                   
		        	
		        }

		        /**
		        * Close Bulk Content Container
		        **/
				_self.closeBulkItems = function(){									
					$scope.$parent.$parent.config.showBulkActionsContent = false;	
				};

				/**
				* Removes clicked employee from the bulk item list
				**/
				_self.removeSelectedItems = function(){

					var duplicateSelectedEmployees = angular.copy(_self.selectedEmployees);

					_self.removeUnnecessaryObjectProperties(duplicateSelectedEmployees);

					var totalSelectedEmployees = duplicateSelectedEmployees.filter(_self.filterPropertiesOfSelectedEmployees);
					var totalSelectedEmployeeIds = _self.selectedEmployeeIds;

					_self.selectedEmployeeIds = [];					

					if ( totalSelectedEmployees.length > 0 && totalSelectedEmployeeIds.length > 0 ) {

						_self.showLoader = true;
						ActiveRecordFactory.removeActiveRecord({ ids : totalSelectedEmployeeIds, userId : _self.authorizeUserId }, 'employees/removeEmployee').then(function( response ){
							if ( response.success ) {
								
								_self.showLoader = false;

								$scope.$parent.$parent.addAlert('employeeListAlerts', {
                                    type: 'success',
                                    msg: 'Employee List Details Successfully Deleted.'
                                });     

                                $scope.$parent.$parent.getEmployeeList();

								_self.closeBulkItems();
							}
						});
					}

				};

				/**
				* Sets to export selected employees for reports purposes
				**/
				_self.exportItems = function(){

				};

				/**
				* Toggles event for the date picker pop-up
				**/
				_self.toggle = function($event, field, event) {

			      	$event.preventDefault();
			      	$event.stopPropagation();
			      	event[field] = !event[field];

			    };

			    /**
			    * Updates employee's department assigned/ record status
			    **/
				_self.saveChanges = function(){

					var duplicateSelectedEmployees = angular.copy(_self.selectedEmployees);

					_self.removeUnnecessaryObjectProperties(duplicateSelectedEmployees);

					var totalSelectedEmployees = duplicateSelectedEmployees.filter(_self.filterPropertiesOfSelectedEmployees);
					var totalSelectedEmployeeIds = _self.selectedEmployeeIds;

					_self.selectedEmployeeIds = [];							

					if ( totalSelectedEmployees.length > 0 && totalSelectedEmployeeIds.length > 0 ) {

						_self.showLoader = true;
						ActiveRecordFactory.updateActiveRecord({ ids : totalSelectedEmployeeIds, data : totalSelectedEmployees[0], userId : _self.authorizeUserId }, 'employees/saveEmployee').then(function( response ){
							if ( response.success ) {
								
								_self.showLoader = false;

								$scope.$parent.$parent.addAlert('employeeListAlerts', {
                                    type: 'success',
                                    msg: 'Employee List Details Successfully Updated.'
                                });     

                                $scope.$parent.$parent.getEmployeeList();

								_self.closeBulkItems();
							}
						});
					}
				};				

			}],

			controllerAs : 'vm'
		}

	});

	cereliDirectives.directive('ajaxLoader', function(){

		return {
			
			restrict : 'E',

			transclude : true,

			templateUrl : 'templates/common/ajax-loader.html',

			scope : {
				showLoader : '=',
			}
		};

	});

	cereliDirectives.directive('checkInputContentExists', function( ActiveRecordFactory, $timeout ){ 

		return {

			scope : {
				checkInputContentExists : '='			
			},

			link : function( scope, element, attrs ){						

				var timeout;			

				element.on('blur', function(){

					clearTimeout(timeout);

					timeout = $timeout(function(){

						ActiveRecordFactory.getActiveRecord( { criteria : scope.checkInputContentExists }, attrs.model + '/' + attrs.checkUrl ).then(function( response ){
							if (  response.success && response.data.length > 0 ) {
								element.$setValidity('exists', true);							
							}
						});

					}, 350);

				});				

			}

		}

	});

	cereliDirectives.directive('selectEmployee', function(ActiveRecordFactory, $timeout){

		return {
			
			scope: {
				selectEmployee : '=',
			},

			link : function( scope, element, attrs) {			

				var timeout;

				element.on('keyup paste search', function( item ){

					clearTimeout(timeout);

					timeout = $timeout(function(){

						scope.selectEmployee = element[0].value;

						ActiveRecordFactory.getActiveRecord({ criteria : scope.selectEmployee }, 'employees/getEmployee')
							.then(function( response ){
								if ( response.success ) {
									
									scope.searchEmployeeEntries.push(response.data);
									scope.$apply();
								}
						})

					}, attrs.delay || 250);

				});

			}
		};

	});

    /** 
    *for year selector dropdown
    **/
    cereliDirectives.directive('dropdownSelector',function(){        

    	var currentYear = new Date().getFullYear();

        return {

        	restrict : 'EA',

        	scope : {
            	type : '@',
            	model : '=',
            	empId : '='
        	},        	

            link: function(scope, element, attrs){

                scope.typeOptions = [];

                if ( scope.type == 'year' ) {

	                for (var i = +attrs.offset; i < +attrs.range + 1; i++){
	                    scope.typeOptions.push(currentYear - i);
	                }            	               
                } else {
                	scope.typeOptions = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];  
                }

            	scope.model = scope.model || currentYear;

            }, 

            templateUrl : 'templates/common/dropdown-selector.html',

            controller : [ '$scope', 'ActiveRecordFactory', function( $scope, ActiveRecordFactory ) {            	

            	$scope.changeItem = function( newItem ){
            		$scope.model = newItem;
            	};
            }]
        }
    });   

    /** 
    *for month selector dropdown
    **/
    cereliDirectives.directive('monthDropdown',function(){

        var currentYear = new Date().getFullYear();

        return {

        	scope : {
        		selectedMonth : '='
        	},

            link: function(scope, element, attrs){

                scope.months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];               

                // scope.selectedMonth = currentYear.getMonth();
            },
            template: '<select ng-model="selectedMonth" ng-options="m for m in months"></select>'

        }
    });

    cereliDirectives.directive('totalEmployeesInDepartment', function(){
		
		return {		

			scope : {
				departmentId : "=",
				employeeList : "="
			},

			link : function( scope, element, attrs ){

				scope.results = [];		

				console.log(scope.employeeList)				

				if ( scope.departmentId > 0 ) {

					angular.forEach(scope.employeeList, function( value , key ){

						console.log(value)
						if (  value.departmentAssigned == scope.departmentId ) {
							results.push(value);
						}
					});

				}

			},

			template : '{{ results }}'
		}    	
    })

	cereliDirectives.directive('showSubdetailsEmployee', function(){

		return {		

			scope : { id : '@' },			

			link : function( scope, element, attr ) {				

				if ( scope.id > 0 ) {

					angular.forEach(scope.$parent.departmentList, function(value, key){

						if ( value.id == scope.id ) {						
							scope.selectedDepartment = value.departmentName;	
							scope.$parent.departmentAssigned = value.departmentName;																				
						}
					});

				} else {
					scope.selectedDepartment = "Not yet specified"					
				}				
			}, 		

			template : '{{ selectedDepartment }}',
		};

	});

	cereliDirectives.directive('employeeStatisticsReport', [ 'moment', 'ActiveRecordFactory', function( moment, ActiveRecordFactory ){

		return {

			restrict : 'E',

			transclude : true,

			scope : {
				statisticsRecordResult : '=',
				employeeTimeRecords : '=',
				empId : '=',
			},

			templateUrl : 'templates/employees/employee-statistics-report.html',

			controller : function( $scope ){

				var _self = this;		

				$scope.initDate = moment();	
				$scope.selectedYear = $scope.initDate.format('YYYY');
				$scope.selectedMonth = $scope.initDate.format('MMMM');
				$scope.chartDataValues = [];
				$scope.daysOfCurrentMonth = [];	
				$scope.pieChartValues = [];
				$scope.chartIsEmpty = true;


			 	$scope.timeRecordTypes = [
					{ name : 'Attended', value : 1 },
					{ name : 'Absent', value : 2 },
					{ name : 'Leave(Paid)', value : 3 },
					{ name : 'Leave(Unpaid)', value : 4 }
				];	

				$scope.$watchCollection('[selectedYear, selectedMonth, statisticsRecordResult, chartDataValues]', function(newValue, oldValue){

			 	 	if ( newValue[0] !== oldValue[0] || newValue[1] !== oldValue[1] ) {				 	 		
			 	 		$scope.getReportsBy(newValue[0] + ' ' + newValue[1]);
			 	 	}

			 	 	if ( newValue[2] !== oldValue[2] ) {
			 	 		_self.init();
			 	 	}

			 	 	if ( (newValue[3] !== oldValue[3]) ) {
			 	 		_self.initChartOptions();
			 	 	}

                }); 

				_self.init = function(){

					_self.employeeTimeRecordsList = [];	
					_self.timeRecordsGroup = [];					

					for (var key in $scope.statisticsRecordResult) {				  	

	                	var employeeTimeRecord = $scope.statisticsRecordResult[key];	                	
	                	
	               		employeeTimeRecord.startsAt = moment($scope.statisticsRecordResult[key].startsAt).toDate();
	                	
	                	if ( $scope.statisticsRecordResult[key].endsAt.length > 0 ) {
	                		employeeTimeRecord.endsAt = moment($scope.statisticsRecordResult[key].endsAt).toDate();
	                	} else {
	                		employeeTimeRecord.endsAt = moment($scope.statisticsRecordResult[key].startsAt).add(1,'hours').toDate();
	                	}	  
	                	
	                	_self.employeeTimeRecordsList.push({ type :  $scope.statisticsRecordResult[key].timeRecordType, startsAt : employeeTimeRecord.startsAt, endsAt:  employeeTimeRecord.endsAt });
					} 

				 	_self.employeeTimeRecordsList.map(function( obj ){			 		

				 		if ( angular.isObject(obj) ) {			 			
				 			_self.timeRecordsGroup[obj.type] = [];
				 		}
				 	});

				 	_self.employeeTimeRecordsList.map(function( obj ){			 		

				 		if ( angular.isObject(obj) ) {			 			

				 			var groupByDate = moment(obj.startsAt);

				 			_self.timeRecordsGroup[obj.type][groupByDate.format('D')] = [];
				 		}
				 	});

			 		_self.employeeTimeRecordsList.map(function( obj ){			 		
				 		if ( angular.isObject(obj) ) {		
				 			var groupByDate = moment(obj.startsAt);					 					 			 						
				 			_self.timeRecordsGroup[obj.type][groupByDate.format('D')].push(obj);
				 		}
				 	});


				 	_self.timeRecordsGroup.map(function( parentItem, parentIndex ){		

				 		parentItem.map(function( childItem, childIndex ){

				 			var item = childItem;				 			

					 		if ( angular.isArray( item ) && item.length > 1 ) {

					 			var groupByDate = moment(item[0].startsAt);					 					 			 						

					 			var totalHoursRendered = Math.abs( item[0].startsAt - item[item.length-1].startsAt  ) / 36e5;

					 			_self.timeRecordsGroup[parentIndex][groupByDate.format('D')] = totalHoursRendered;				 			
					 			
					 		} else {
					 			var totalHoursRendered = Math.abs( item[0].startsAt - item[0].endsAt  ) / 36e5;
					 			var groupByDate = moment(item[0].startsAt);					 					 			 						

					 			_self.timeRecordsGroup[parentIndex][groupByDate.format('D')] = totalHoursRendered;			 			
					 			
					 		}
				 		});

				 	});		 	 				 			 			

		 			$scope.mapTimeRecordsGroup();						

		 			$scope.calculateTimeRecordGroup();

					$scope.getDaysInMonth($scope.initDate);             
	
				};

				_self.initChartOptions = function(){

				 	$scope.chartOptions = {
				 		 chart: {
				            type: 'spline'
				        },
	                    title: {
	                        text: 'Monthly Employee Time Record'
	                    },
	                    xAxis: {
	                        categories: $scope.daysOfCurrentMonth,
	                        title: {
				                text: 'Days of ' + $scope.selectedMonth
				            }				            
	                    },

	                    yAxis: {
				            min: 0,
				            title: {
				                text: 'Rendered Hours Per Month(hrs)'
				            },
			              	labels: {
				                format: '{value} hr(s)'
				            },
				            plotBands : [
				            	{ // Overtime
					                from: 9,
					                to: 150,					                
					                color: '#ffbcb3',
					                label: {
					                    text: 'Overtime Hours',
					                    style: {
					                        color: '#fff'					                        
					                    }
					                }
					            }
				            ]
				        },

	                 	tooltip: {
				            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
				            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
				                '<td style="padding:0"><b>{point.y:.1f} hours</b></td></tr>',
				            footerFormat: '</table>',
				            shared: true,
				            useHTML: true
				        },
				        plotOptions: {
				            spline: {
				                lineWidth: 3.5,
				                states: {
				                    hover: {
				                        lineWidth: 4.5
				                    }
				                },
				                marker: {
				                    enabled: false
				                }				                
				            }
				        },
				        series: [{
				            name: 'Attended',
				            data: $scope.chartDataValues[0]

				        }, {
				            name: 'Absent',
				            data: $scope.chartDataValues[1]

				        }, {
				            name: 'Paid/Unpaid Leaves',
				            data: $scope.chartDataValues[2]

				        }]
	                };

	                $scope.pieOptions = {
	                    chart: {
	                        type: 'pie'
	                    },
	                    title: {
	                        text: "Time Records Pie Ratio month of " + $scope.selectedMonth,
	                    },
	                    plotOptions: {
	                        pie: {
	                            allowPointSelect: true,
	                            cursor: 'pointer',
	                            dataLabels: {
	                                enabled: true,
	                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
	                            }
	                        }
	                    },
	                    tooltip: {				           
				            pointFormat: '<b>{point.y:.1f} hours</b>',				           
				            shared: true,
				            useHTML: true
				        },
	                    series: [{
	                        data: [{
			                        name: "Attended",
			                        y: $scope.pieChartValues[0],
			                        sliced: true,
			                        selected: true
			                    }, {
			                        name: "Absent",
			                        y: $scope.pieChartValues[1]			                        
			                    }, {
			                        name: "Paid/Unpaid Leaves",
			                        y: $scope.pieChartValues[2]
			                    }
			                ]
	                    }]
                	};
					

				};			

				$scope.getDaysInMonth = function( selectedDate ){					

					var totalDaysOfMonth = moment(selectedDate).daysInMonth(),
						i;

					$scope.daysOfCurrentMonth = [];

					for( i = 1; i <= totalDaysOfMonth; i++ ) {
						$scope.daysOfCurrentMonth.push(i);
					};					

				};

				$scope.mapTimeRecordsGroup = function() {

					if ( _self.timeRecordsGroup.length > 0 ) {
						var i, tempDaysResults = [],tempRecordsResults = [];


						//pre populate temp list for number of days of the month
						for ( i = 0; i <= ($scope.daysOfCurrentMonth.length -1 ); i++ ) {
							tempDaysResults.push(0);
						}						

						Object.keys(_self.timeRecordsGroup).forEach(function( item, i ){				
							
							var clonedDaysResults = angular.copy(tempDaysResults);							

							angular.forEach(_self.timeRecordsGroup[item], function( value, key ){														
								clonedDaysResults[key] = value;								
							});

							tempRecordsResults.push(clonedDaysResults);

						});						

						$scope.chartDataValues = tempRecordsResults;
					}

				};	

				$scope.calculateTimeRecordGroup = function(){

					if ( angular.isObject(_self.timeRecordsGroup) && _self.timeRecordsGroup ) {

						var tempRecordsResults = [];					

						angular.forEach(_self.timeRecordsGroup, function( parentItem, key){

							var tempTotalHours = 0;

							angular.forEach(parentItem, function( childItem, index ){
								tempTotalHours += parseInt(childItem.toFixed(1));
							});

							tempRecordsResults.push(tempTotalHours)
						});

						$scope.pieChartValues = tempRecordsResults;						

					}
				};	 	 	

			 	$scope.getReportsBy = function( date ){

			 		var selectedDate = moment(date);

			 		$scope.$parent.childLoader = true;

			 		if ( selectedDate.isValid() ) {				 						

			 			$scope.getDaysInMonth(date);			 			

		 				ActiveRecordFactory.getActiveRecord({ id: $scope.empId, date : selectedDate }, 'employee_time_records/getEmployeeStatisticsReport').then(function( response ){
		 					if ( response.success ) {
			 					$scope.$parent.childLoader = false;

			 					if ( response.data.length > 0 ) {
                            		$scope.statisticsRecordResult = response.data;		 									 						
			 						$scope.chartIsEmpty = false;
			 					} else {
			 						$scope.chartIsEmpty = true;
			 					}
		 					}
		 				})	
			 		}

			 	};

			 	if ( $scope.statisticsRecordResult.length ) {
					_self.init();			 				 		
			 	}

			}
		};

	}] );

	/**
	* Employee's Details and Time Record Details with Calendar View	
	**/
	cereliDirectives.directive('employeeDailyTimeRecordCalendar', [ '$location', '$anchorScroll', 'calendarConfig', 'ActiveRecordFactory', '$timeout', 'moment',
		function( $location, $anchorScroll, calendarConfig, ActiveRecordFactory, $timeout, moment ){

		return {

			restrict : 'E',

			transclude : true,

			templateUrl : 'templates/employees/daily-time-record-calendar.html',

			controller : function( $scope ){

				var _self = this;		

				calendarConfig.templates.calendarMonthCell = 'groupedMonthEvents.html';

			    $scope.$on('$destroy', function() {
			      calendarConfig.templates.calendarMonthCell = 'mwl/calendarMonthCell.html';
			    });
				

				_self.employeeTimeRecordAlerts = [];					
                _self.isCellOpen = false;  
				_self.timeRecordSelected = false;
                _self.isEditMode = false;
                _self.employeeDetails = $scope.employee;

		        $scope.addAlert = function(type, options) {
		            _self[type].push(options);
		        };

		        $scope.closeAlert = function(type, index) {
		            _self[type].splice(index, 1);
		        };

		        $scope.$watchCollection('[employeeTimeRecords, employee]', function( newValue ){

		        	_self.initializeCalendar();
		        	_self.employeeDetails = newValue[1];

		        });
		      
                //Daily Time Record 
                _self.calendarView = 'year';           
                _self.viewDate = moment().startOf('year').toDate();

                var actions = [{
                  label: '<i class=\'fa fa-pencil\'></i>',

                  onClick: function(args) {

                    console.log('Editing Record : ', args.calendarEvent); 

                	$location.hash('timeRecordEditor');
                	$anchorScroll();

                    _self.timeRecordSelected = true;
                	_self.isEditMode = true;

                	_self.time_record = {
                		id : args.calendarEvent.id,
                		empId : args.calendarEvent.empId,
                		remarks : ( args.calendarEvent.remarks.length ? args.calendarEvent.remarks : args.calendarEvent.title ),
                		startsAt : args.calendarEvent.startsAt,
                		endsAt : args.calendarEvent.endsAt,
                		timeRecordType : args.calendarEvent.timeRecordType
                	};

                	_self.time_record.calendarEvent = args.calendarEvent;


                  }
                }, 
                {                	
                  label: '<i class=\'fa fa-trash\'></i>',
                  onClick: function(args) {                   

                    ActiveRecordFactory.removeActiveRecord( { id : args.calendarEvent.id, fullName : _self.employeeDetails.fullName, empId : _self.employeeDetails.empId }, 'employee_time_records/removeEmployeeTimeRecord').then(function( response ){
                    	if ( response.success ) {
                    		console.info('Deleted Record : ', args.calendarEvent);
                    		_self.events.splice(_self.events.indexOf(args.calendarEvent), 1);                    		
                    		
                    		$scope.addAlert('employeeTimeRecordAlerts', {
                                type: 'info',
                                msg: 'Time Record Details \'' + args.calendarEvent.startsAt.toUTCString() + '\' Successfully Deleted'
                            }); 

                    	}
                    });

                  }

                }];	

                _self.recordTypes = [
                	// { text : 'Select Record Type', value : 0 },
                	{ text : 'Attended', value : 1 },
                	{ text : 'Absent', value : 2 },
                	{ text : 'Leave(Paid)', value : 3 },
                	{ text : 'Leave(Unpaid)', value : 4 }
                ];		                   

                _self.eventTempObj = {
                	title : 'Time clock-in/out' ,
                	color : calendarConfig.colorTypes.info,
                	type : 'info',
                	startsAt : '',
                	endsAt : '',
            	 	draggable: true,
            	 	incrementsBadgeTotal: true,
                    resizable: false,
                    actions: actions
                };

                _self.time_record_datePicker = {};

                _self.time_record_dp_options = {
                	startsAt : {
                		formatYear: 'yy',
                    	startingDay: 1                    		
                	},
                	endsAt : {
                		formatYear: 'yy',
                        startingDay: 1    
                	}
                };

                _self.mergeObjects = function( obj1, obj2 ){
                	var obj3 = {};
				    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
				    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
				    return obj3;
                };

               	_self.viewChangeClicked = function(date, nextView) {

			      	// console.log(moment(date).format('MMM'), nextView);

			      	_self.time_record_dp_options.startsAt.initDate = moment(date).toDate();		      	
			      	_self.time_record_dp_options.endsAt.initDate = moment(date).toDate();		      				      	
			    };

			    _self.onChangeStartsAt = function(){			    	
			    	_self.time_record_dp_options.endsAt.minDate = _self.time_record.startsAt;
			    };

             	_self.toggle = function($event, field, event) {

			      	$event.preventDefault();
			      	$event.stopPropagation();
			      	event[field] = !event[field];

			    };

			    _self.refreshDTRCalendar = function(){

			    	ActiveRecordFactory.getActiveRecord({ id : empId }, 'employees/getEmployeeTimeRecord').then(function(response){
			    		$scope.employeeTimeRecords = response.data;	

			    		_self.initializeCalendar();
			    	});

			    };

			    _self.checkIfWeekend = function(cell) {

			      	cell.groups = {};
			      	cell.events.forEach(function(event) {
			      		// console.log(event);
				        cell.groups[event.type] = cell.groups[event.type] || [];
					    cell.groups[event.type].push(event);
		     	 	});	     	

			    };

			    _self.cancelEditTimeRecord = function(){
			    	_self.timeRecordSelected = false;
                	_self.isEditMode = false;
			    };

			    _self.addTimeRecord = function(){            	
                	
                	_self.timeRecordSelected = true;
                	_self.isEditMode = false;

                	$location.hash('timeRecordEditor');
                	$anchorScroll();

                	_self.time_record = {
                		id : 0,
                		empId : _self.employeeDetails.empId,
                		remarks : '',                	
                		startsAt : '',
                		endsAt : '',
                		timeRecordType : ''
                	};

                	_self.time_record.calendarEvent = {
	                	title : '' ,
	                	color : calendarConfig.colorTypes.info,
	                	startsAt : '',
	                	endsAt : '',
	                	type : 'info',
	            	 	draggable: true,
	                    resizable: true,
	                    actions: actions
	                };                          

                };    

                _self.getTimeRecordType = function( selectedType ) {

                	if ( selectedType == 1 ) {
            			return { color : calendarConfig.colorTypes.info, type : 'info' };
            		} else if ( selectedType == 2 ) {
            			return { color : calendarConfig.colorTypes.warning, type : 'warning' };
            			
            		} else if ( selectedType == 3 || selectedType == 4) {
            			return { color : calendarConfig.colorTypes.special, type : 'special' };
            			
            		} else {
            			return { color : calendarConfig.colorTypes.important, type : 'important' };            			
            		}                	
                };   

                _self.saveTimeRecord = function(){

                	console.log('Is Edit Mode?', _self.isEditMode);

                	var calendarEvent = _self.time_record.calendarEvent;

                	var oldCalendarEvent = calendarEvent;

            		delete _self.time_record.calendarEvent;

                	var newCalendarEvent = _self.mergeObjects(calendarEvent,_self.time_record);

                	var recordType = _self.getTimeRecordType(_self.time_record.timeRecordType);

                	_self.time_record.date = moment(_self.time_record.startsAt).format('YYYY-MM-DD');

                	newCalendarEvent.title = _self.time_record.remarks;
                	newCalendarEvent.color = recordType.color;
                	newCalendarEvent.type = recordType.type;

            		console.log('Saving Time Record : ',_self.time_record);  

	           	  	ActiveRecordFactory.saveActiveRecord(_self.time_record, _self.isEditMode, 'employee_time_records/saveEmployeeTimeRecord').then(function( response ){
                    	if ( response.success ) {

                    		if ( !_self.isEditMode ) _self.events.push(newCalendarEvent);                    		
		                 	
		                 	_self.timeRecordSelected = false;	

		                 	var eventIndex = _self.events.indexOf(oldCalendarEvent);

		                 	_self.events[eventIndex] = newCalendarEvent;		                 	               	
                    		
                    		$scope.addAlert('employeeTimeRecordAlerts', {
                                type: 'success',
                                msg: 'Time Record Details \'' + newCalendarEvent.startsAt.toUTCString() + '\' Successfully Saved'
                            }); 
                    	}
                    });
                };  

                _self.removeTimeRecord = function(){

	           	  	ActiveRecordFactory.removeActiveRecord( { id : _self.time_record.calendarEvent.id, fullName : _self.employeeDetails.fullName, empId : _self.employeeDetails.empId }, 'employee_time_records/removeEmployeeTimeRecord').then(function( response ){
                    	if ( response.success ) {
                    		console.log('Deleted Record : ' + _self.time_record.calendarEvent);

                    		_self.events.splice(_self.events.indexOf(_self.time_record.calendarEvent), 1);                    		
		                 	
		                 	_self.timeRecordSelected = false;
		                	_self.isEditMode = false;
                    		
                    		$scope.addAlert('employeeTimeRecordAlerts', {
                                type: 'info',
                                msg: 'Time Record Details \'' + _self.time_record.calendarEvent.startsAt.toUTCString() + '\' Successfully Deleted'
                            }); 
                    	}
                    });
                };                 
              
                _self.eventTimesChanged = function(event) {

                  	console.log('Dropped or resized Record : ', event);

                  	$timeout(function(){

	                  	_self.time_record = {
	                		id : event.id,
	                		empId : event.empId,
	                		remarks : event.remarks,
	                		startsAt : event.startsAt,
	                		endsAt : event.endsAt,
	                		timeRecordType : event.timeRecordType
	                	};

	                  	ActiveRecordFactory.saveActiveRecord(_self.time_record, true, 'employee_time_records/saveEmployeeTimeRecord').then(function( response ){
	                    	if ( response.success ) {
	                    		console.log('Updated Record : ',event);  

	                    		$scope.addAlert('employeeTimeRecordAlerts', {
	                                type: 'info',
	                                msg: 'Time Record Details \'' + event.startsAt.toUTCString() + '\' Successfully Moved.'
	                            });                   		              				                 	
	                    	}
	                    });

                  	},200);

                }; 

                _self.toggle = function($event, field, event) {
				      $event.preventDefault();
				      $event.stopPropagation();
				      event[field] = !event[field];
				};                

				_self.initializeCalendar = function(){

					_self.events = [];	

					if ( $scope.employeeTimeRecords.length ) {

						for (var key in $scope.employeeTimeRecords) {				  	

		                	var employeeTimeRecord = _self.mergeObjects(_self.eventTempObj, $scope.employeeTimeRecords[key] );

		                	if ( employeeTimeRecord.remarks.length > 0 ) employeeTimeRecord.title = employeeTimeRecord.remarks;
		                	
		               		employeeTimeRecord.startsAt = moment($scope.employeeTimeRecords[key].startsAt).toDate();
		                	
		                	if ( $scope.employeeTimeRecords[key].endsAt.length > 0 ) {
		                		employeeTimeRecord.endsAt = moment($scope.employeeTimeRecords[key].endsAt).toDate();
		                	} else {
		                		employeeTimeRecord.endsAt = moment($scope.employeeTimeRecords[key].startsAt).add(1,'hours').toDate();
		                	}

		                	var recordType = _self.getTimeRecordType(employeeTimeRecord.timeRecordType);

		                	employeeTimeRecord.type = recordType.type;
		                	employeeTimeRecord.color = recordType.color;
		                	
		                	_self.events.push(employeeTimeRecord);

						}  
					}
					
				};

				_self.initializeCalendar();		


			},
			controllerAs : 'employeeDailyTimeRecordCalendarCtrl'
		}
	}]);
	
	/**
	* Employee's Tracking Activities
	**/
	cereliDirectives.directive('employeeTrackingActivities', [ 'ActiveRecordFactory', 'moment', function( ActiveRecordFactory, moment ){

		return {

			restrict : 'E',

			transclude : true,

			templateUrl : 'templates/employees/employee-tracking-activities.html',

			scope : {
				empId : '@',				
				showLoader : '=',
				activities : '='
			},

			controller : [ '$scope', function( $scope ){

				var _self = this;					

			    _self.getAllEmployeeActivities = function(){
        
			        _self.showLoader = true;			        

			        ActiveRecordFactory.getActiveRecord({ lastActivityRecord : $scope.$parent.lastActivityRecord }, 'employee_activities/getAllEmployeeActivities').then(function( response ){
			            if ( response.success) {
			                _self.showLoader = false;                                

			                if ( response.data.length > 0 ) {			                	

			                	angular.forEach(response.data, function( item, index ){
			                		$scope.$parent.activities.push(item);
			                	});   		                				                	

			                	$scope.$parent.lastActivityRecord = _self.lastActivityRecord = $scope.$parent.activities[$scope.$parent.activities.length-1].dateCommitted;            			                	
			                } else {
			                	$scope.$parent.lastActivityRecord = _self.lastActivityRecord = moment($scope.$parent.lastActivityRecord).subtract(8,'days').format('YYYY-MM-DD');            			                	
			                }
			            }
			        });
			    };


			}],

			controllerAs : 'employeeTrackingActivitiesCtrl'
		};

	}] );
	

	cereliDirectives.directive('calendarControls', function(){

		return {

			restrict : 'E',

			require : [ '^employeeDailyTimeRecordCalendar' , '^employeeEventCalendar' ],

			transclude : true,

			scope : {
				viewdate : '=',
				calendarview : '=',
				showLoader : '='				
			},

			templateUrl : 'templates/employees/calendar-controls.html'
			
		};

	});

	/**
	* Directive for Employee import/export time records
 	**/
	cereliDirectives.directive('employeeToolsOptions', [ 'Upload', '$timeout', '$uibModal', 'PagerService', function( Upload, $timeout, $uibModal, PagerService ){
		
		return {
			
			restrict : 'E',

			transclude : true,

			templateUrl : 'templates/employees/tools-options.html',

			controllerAs : 'employeeToolsOptionsCtrl',

			controller : [ '$scope', function( $scope ){

				var _self = this;								
					
				$scope.importEmployeeRecordsMessage = "Reading ...";
				$scope.importTimeRecordsMessage = "Reading ...";

				_self.message = '';
				
              	_self.accordionSettings = {
					status : {
			            isCustomHeaderOpen: false,
			            isFirstOpen: true,
			            isFirstDisabled: false
		        	}
		        }; 
		       
		        _self.uploadEmployees = function( file ){

		        	if ( file ) {

			        	Upload.upload({
		                	url : 'employees/uploadCsvRecords',
			                data : { file: file, userId : $scope.authorizeUser.user.id }
			            }).then(function( response ){
			                if ( response.status == 200 ) {
			                	$scope.fileImportEmployeesPercentage = 0;
			                	_self.message = response.data.message;		                	
			                }
			            }, function( response ){
			            	console.log('Error status: ' + response.status);
			            }, function( evt ){		

			            	var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		            		$scope.fileImportEmployeesPercentage = progressPercentage;
		            		$scope.importEmployeeRecordsMessage = 'Reading...Please wait..';						        

			            });		     
		        	}


		        };

				_self.submitUpload = function(){

					console.info('Importing selected file...');					
		            
		            if ( $scope.importRecordForm.importFile.$valid && _self.importFile ) {
		                _self.upload($scope.importFile);
		            } 
		        };

		        _self.openUploadedRecordsModal = function( list ){

		        	var modalInstance = $uibModal.open({
	        		   	animation: true,
			            keyboard : false,
			            backdrop : false,
			            templateUrl : 'templates/employees/show-uploaded-time-records.html',
			            size: 'lg',
			            resolve : {
			            	getList : function(){
			            		return list;
			            	}
			            },

			            controllerAs : 'vm',

			            controller: function( $scope, getList ){			   

			            	$scope.mainDataList = getList;

			            	this.pager = {};
			            	this.dummyList = getList;

					    	this.setPage = function( page ){            

						        if (page < 1 || page > this.pager.totalPages) {
						            return;
						        }

						        // get pager object from service
						        var pagerInstance = new PagerService(this.dummyList.length, 25);

						        this.pager = pagerInstance.getPager(page);

						        // get current page of items
						        $scope.mainDataList = this.dummyList.slice(this.pager.startIndex, this.pager.endIndex + 1);
						        
						    };						    

			            	this.setPage(1);

		            	 	$scope.modalOptions = {
			                    headerText : 'Uploaded Time Records',    
			                    closeButtonText : 'Close',		                    
			                    close : function(){
			                        modalInstance.dismiss('cancel');
			                    }
			                };
			            }
		        	});

		        };

		        _self.uploadTimeRecords = function( file ){    			        	            

		        	if ( file ) {

	        			Upload.upload({
		                	url : 'employee_time_records/uploadTimeRecord',
			                data : { file: file, userId : $scope.authorizeUser.user.id }
			            }).then(function( response ){
			                if ( response.status == 200 ) {
			                	$scope.fileImportTimeRecordsPercentage = 0;
			                	_self.message = response.data.message;
			                	_self.openUploadedRecordsModal(response.data.data);		                	
			                }
			            }, function( response ){
			            	console.log('Error status: ' + response.status);
			            }, function( evt ){		

			            	var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		            		$scope.fileImportTimeRecordsPercentage = progressPercentage;
		            		$scope.importTimeRecordsMessage = 'Reading...Please wait.';						        

			            });		        		
		        	}
		        };
			}]
		}
	} ]);

	cereliDirectives.directive('sortDataList', [ 'ActiveRecordFactory', function( ActiveRecordFactory ){

		return {

			restrict : 'E',		

			scope : true,			

			bindToController : {
				options : '=',
				orderBy : '=',				
				title : '='							
			},

			template : '<a tooltip-placement="bottom" uib-tooltip="{{vm.title}} - {{vm.orderType}} " ng-click="vm.sort();" ng-class="{\'sorting_asc\' : (vm.orderType == \'ASC\'), \'sorting_desc\' : (vm.orderType == \'DESC\')}">{{ vm.title }} </a>',

			controller : function( $scope ){					

				var _self = this;

				_self.orderType = 'DESC';				
				
				_self.sort = function(){

					console.info('Sorting by ' + _self.orderBy + '...');
					ActiveRecordFactory.getActiveRecord({ data : { orderType : _self.orderType, orderBy : _self.orderBy } }, _self.options.type + '/sortBy').then(function( response ){
						if (  response  ) {		

							$scope.$parent.$parent.mainDataList = response.data;

							if ( _self.orderType == 'ASC' ) {
								_self.orderType = 'DESC';
							} else {
								_self.orderType = 'ASC';
							}
						}

					});				

				};

			},

			controllerAs : 'vm'
		};

	}] );

	cereliDirectives.directive('hcCustomGraph', function(){

		return {	

			restrict : 'E',

			template : '<div></div>',

			scope : {
				options : '='				
			},

			link : function( scope, element ){

				Highcharts.setOptions({
			     	colors: ['#00c0ef', '#ff851b', '#605ca8']
			    });

				Highcharts.chart(element[0], scope.options);

				scope.$watch('options', function( newValue, oldValue ){
					if ( newValue ) {						
						Highcharts.chart(element[0], newValue);						
					}
				})
			}
		};

	});

	// cereliDirectives.directive('tabs', function(){

	// 	return {

	// 		restrict : 'E',

	// 		transclude : true,

	// 		scope : {},

	// 		controller : function( $scope , $element ){

	// 			var panes = $scope.panes = [];

	// 			$scope.select = function( pane ) {

	// 				angular.forEach(panes, function(pane){

	// 					pane.selected = false;

	// 				});

	// 				pane.selected = true;
	// 			};

	// 			this.isSet = function( checkTab ) {};

	// 			this.addPane = function( pane ) {
	// 				if ( pane.length !== 0 ) $scope.select(pane);

	// 				panes.push(pane);
	// 			};
	// 		},

	// 		templateUrl : './templates/common/tabs.html',

	// 		replace : true
	// 	};

	// });

	// cereliDirectives.directive('pane', function(){

	// 	return {

	// 		require : '^tabs',

	// 		restrict : 'E',

	// 		transclude : true,

	// 		scope : { title : '@' },

	// 		link : function ( scope, element, attrs, tabsController ) {

	// 			tabsController.addPane(scope);
	// 		},

	// 		controller : function( $scope, $element ){

	// 			var forms = $scope.forms = [];

	// 			this.addForm = function(form){

	// 				forms.push(form);

	// 			};
	// 		},

	// 		templateUrl : './templates/common/pane.html',

	// 		replace : true
	// 	};

	// });

})();
