(function(){

	var cereliDirectives = angular.module('cereliDirectives', [ 'ngFileUpload' ] );


	cereliDirectives.controller('DashboardController' , [ '$scope' ,function( $scope ){

	}]);

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
				return 'Not yet specified.'
			}
			return value;
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

	cereliDirectives.directive('checkInputContentExists', function( activeRecordService, $timeout ){ 

		return {

			scope : {
				checkInputContentExists : '='			
			},

			link : function( scope, element, attrs ){						

				var timeout;			

				element.on('blur', function(){

					clearTimeout(timeout);

					timeout = $timeout(function(){

						activeRecordService.getActiveRecord( { criteria : scope.checkInputContentExists }, attrs.model + '/' + attrs.checkUrl ).then(function( response ){
							if (  response.success && response.data.length > 0 ) {
								element.$setValidity('exists', true);							
							}
						});

					}, 350);

				});				

			}

		}

	});

	cereliDirectives.directive('selectEmployee', function(activeRecordService, $timeout){

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

						activeRecordService.getActiveRecord({ criteria : scope.selectEmployee }, 'employees/getEmployee')
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
    cereliDirectives.directive('yearDropdown',function(){

        var currentYear = new Date().getFullYear();

        return {

        	scope : {
        		modelName : '@'
        	},

            link: function(scope, element, attrs){

                scope.years = [];

                for (var i = +attrs.offset; i < +attrs.range + 1; i++){
                    scope.years.push(currentYear - i);
                }

                scope.selectedYear = currentYear;
            },
            template: '<select ng-model="modelName" ng-options="y for y in years" ng-init="modelName=years[0]"></select>'

        }
    });

	cereliDirectives.directive('showSubdetailsEmployee', function(){

		return {		

			scope : { id : '@', type : '@', index : '@' },			

			link : function( scope, element, attr ) {				

				if ( scope.id > 0 ) {

					angular.forEach(scope.$parent.departmentList, function(value, key){

						if ( value.id == scope.id ) {						
							scope.selectedDepartment = value.departmentName;																					
						}
					});

				} else {
					scope.selectedDepartment = "Not yet specified"					
				}				
			}, 		

			template : '{{ selectedDepartment }}',
		};

	});

	cereliDirectives.directive('employeeStatisticsReport', [ 'moment', function( moment ){

		return {

			restrict : 'E',

			transclude : true,

			scope : {
				statisticsRecordResult : '=',
				employeeTimeRecords : '='
			},

			templateUrl : 'templates/employees/employee-statistics-report.html',

			controller : function( $scope ){

				var _self = this;

				_self.init = function(){

					_self.employeeTimeRecordsList = [];	

					for (var key in $scope.employeeTimeRecords) {				  	

	                	var employeeTimeRecord = $scope.employeeTimeRecords[key];

	                	if ( employeeTimeRecord.remarks.length > 0 ) employeeTimeRecord.title = employeeTimeRecord.remarks;
	                	
	               		employeeTimeRecord.startsAt = moment($scope.employeeTimeRecords[key].startsAt).toDate();
	                	
	                	if ( $scope.employeeTimeRecords[key].endsAt.length > 0 ) {
	                		employeeTimeRecord.endsAt = moment($scope.employeeTimeRecords[key].endsAt).toDate();
	                	} else {
	                		employeeTimeRecord.endsAt = moment($scope.employeeTimeRecords[key].startsAt).add(1,'hours').toDate();
	                	}	  
	                	
	                	_self.employeeTimeRecordsList.push(employeeTimeRecord);

					}  

					_self.eventsGroup = [];					

		     	 	_self.employeeTimeRecordsList.forEach(function(event) {
			      		
			      		var startsAtDate = event.startsAt.toDateString();
		      		
				        _self.eventsGroup[startsAtDate] = _self.eventsGroup[startsAtDate] || [];
					   	_self.eventsGroup[startsAtDate].push(event);	    		     	 	
				 	});


				 	Object.keys(_self.eventsGroup).forEach(function( event, i ){				 		

				 		var item = _self.eventsGroup[event];
				 		
			 			var totalHoursRendered = Math.abs( item[0].startsAt - item[item.length-1].startsAt  ) / 36e5;
			 			item.totalHoursRendered = totalHoursRendered;				 		

				 	});

					console.log(_self.eventsGroup);	
				}

				_self.init();
			 	
				console.log(_self.eventsGroup);		

				$scope.timeRecordTypes = [
					{ name : 'Attended', value : 1 },
					{ name : 'Absent', value : 2 },
					{ name : 'Leave(Paid)', value : 3 },
					{ name : 'Leave(Unpaid)', value : 4 }
				];				

			 	$scope.chartOptions = {
			 		 chart: {
			            type: 'column'
			        },
                    title: {
                        text: 'Yearly Employee Time Record'
                    },
                    xAxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    },

                    yAxis: {
			            min: 0,
			            title: {
			                text: 'Rendered Hours Per Month(hrs)'
			            }
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
			            column: {
			                pointPadding: 0.2,
			                borderWidth: 0
			            }
			        },
			        series: [{
			            name: 'Absents',
			            data: [$scope.statisticsRecordResult[0].recordValue, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

			        }, {
			            name: 'Attended',
			            data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

			        }, {
			            name: 'Paid Leaves',
			            data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

			        }, {
			            name: 'Unpaid Leaves',
			            data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

			        }]
                };

             	// Sample data for pie chart
                $scope.pieData = [{
                        name: "Microsoft Internet Explorer",
                        y: 56.33
                    }, {
                        name: "Chrome",
                        y: 24.03,
                        sliced: true,
                        selected: true
                    }, {
                        name: "Firefox",
                        y: 10.38
                    }, {
                        name: "Safari",
                        y: 4.77
                    }, {
                        name: "Opera",
                        y: 0.91
                    }, {
                        name: "Proprietary or Undetectable",
                        y: 0.2
                }]
			}
		};

	}] );

	/**
	* Employee's Details and Time Record Details with Calendar View	
	**/
	cereliDirectives.directive('employeeDailyTimeRecordCalendar', [ '$location', '$anchorScroll', 'calendarConfig', 'activeRecordService', '$timeout', 'moment',
		function( $location, $anchorScroll, calendarConfig, activeRecordService, $timeout, moment ){

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
		      
                //Daily Time Record 
                _self.calendarView = 'year';           
                _self.viewDate = moment().startOf('year').toDate();

                var actions = [{
                  label: '<i class=\'glyphicon glyphicon-pencil\'></i>',

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
                  label: '<i class=\'glyphicon glyphicon-remove\'></i>',
                  onClick: function(args) {                   

                    activeRecordService.removeActiveRecord(args.calendarEvent.id, 'employee_time_records/removeEmployeeTimeRecord').then(function( response ){
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

			    	activeRecordService.getActiveRecord({ id : empId }, 'employees/getEmployeeTimeRecord').then(function(response){
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

                	newCalendarEvent.title = _self.time_record.remarks;
                	newCalendarEvent.color = recordType.color;
                	newCalendarEvent.type = recordType.type;

            		console.log('Saving Time Record : ',_self.time_record);  

	           	  	activeRecordService.saveActiveRecord(_self.time_record, _self.isEditMode, 'employee_time_records/saveEmployeeTimeRecord').then(function( response ){
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

	           	  	activeRecordService.removeActiveRecord(_self.time_record.calendarEvent.id, 'employee_time_records/removeEmployeeTimeRecord').then(function( response ){
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

	                  	activeRecordService.saveActiveRecord(_self.time_record, true, 'employee_time_records/saveEmployeeTimeRecord').then(function( response ){
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
	cereliDirectives.directive('employeeTrackingActivities', [ 'activeRecordService', function( activeRecordService ){

		return {

			restrict : 'E',

			transclude : true,

			templateUrl : 'templates/employees/employee-tracking-activities.html',

			scope : true,

			bindToController : {
				empId : '@',
				activities : '=',
				showLoader : '='
			},

			controller : function(){

				var _self = this;	

				// console.log(_self)			

				// _self.getTrackingActivities = function(){

				// 	activeRecordService.getActiveRecordList('employee_activities/getAllEmployeeActivities').then(function( response ){
				// 		if ( response.success) {
				// 			_self.activities.push(response.data);
				// 			console.log
				// 		}
				// 	});

				// };

				// if ( _self.empId == 0 ) {
				// 	_self.getTrackingActivities();
				// }

			},

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
	cereliDirectives.directive('employeeToolsOptions', [ 'Upload', '$timeout', function( Upload, $timeout ){
		
		return {
			
			restrict : 'E',

			transclude : true,

			templateUrl : 'templates/employees/tools-options.html',

			controllerAs : 'employeeToolsOptionsCtrl',

			controller : [ '$scope', function( $scope ){

				var _self = this;								

				$scope.exportRecordVars = {				
					exportType : 0,	
					exportDate : new Date()										
				};				
				$scope.importMessage = "Reading ...";

				_self.message = '';
				
                _self.time_record_datePicker = {};

				_self.accordionSettings = {
					status : {
			            isCustomHeaderOpen: false,
			            isFirstOpen: true,
			            isFirstDisabled: false
		        	}
		        }; 

		        _self.toggle = function($event, field, event) {
				      $event.preventDefault();
				      $event.stopPropagation();
				      event[field] = !event[field];
				};                


		        _self.toggleChangeExportType = function(value){
		        	_self.toolsOptions.typeChosen = _self.toolsOptions.exportTypes[value];
		        };

		        _self.toolsOptions = {
		        	exportTypes : [
		        		{
		        			typeName : 'Single',
		        			code : 0,
		        			message : "Pick only one employee per transaction"		        			
		        		},
		        		{	        		
		        			typeName : 'Multiple',
		        			code : 1,
		        			message : "Pick atleast 2 employees to be exported per transaction."
		        		}		        		
		        	]	        	
		        };
		        
		        _self.toolsOptions.typeChosen = _self.toolsOptions.exportTypes[0];

				_self.submitUpload = function(){

					console.info('Importing selected file...');					
		            
		            if ( $scope.importRecordForm.importFile.$valid && _self.importFile ) {
		                _self.upload($scope.importFile);
		            } 
		        };

		        _self.upload = function( file ){    			        	            

		        	if ( file ) {

	        			Upload.upload({
		                	url : 'employees/uploadTimeRecord',
			                data : { file: file, userId : $scope.authorizeUser.user.id }
			            }).then(function( response ){
			                if ( response.status == 200 ) {
			                	$scope.filePercentage = 0;
			                	_self.message = response.data.message;		                	
			                }
			            }, function( response ){
			            	console.log('Error status: ' + response.status);
			            }, function( evt ){		

			            	var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		            		$scope.filePercentage = progressPercentage;
		            		$scope.importMessage = 'Reading...' + progressPercentage + '%';						        

			            });		        		
		        	}
		        };
			}]
		}
	} ]);

	cereliDirectives.directive('sortDataList', [ 'activeRecordService', function( activeRecordService ){

		return {

			restrict : 'E',		

			scope : true,			

			bindToController : {
				options : '=',
				orderBy : '=',				
				title : '='							
			},

			template : '<a uib-tooltip="{{vm.title}} - {{vm.orderType}} " ng-click="vm.sort();" ng-class="{\'sorting_asc\' : (vm.orderType == \'ASC\'), \'sorting_desc\' : (vm.orderType == \'DESC\')}">{{ vm.title }} </a>',

			controller : function( $scope ){					

				var _self = this;

				_self.orderType = 'DESC';				
				
				_self.sort = function(){

					console.info('Sorting by ' + _self.orderBy + '...');
					activeRecordService.getActiveRecord({ data : { orderType : _self.orderType, orderBy : _self.orderBy } }, _self.options.type + '/sortBy').then(function( response ){
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
				Highcharts.chart(element[0], scope.options);
			}
		};

	});
	
    cereliDirectives.directive('hcPieChart', function () {

        return {

            restrict: 'E',

            template: '<div></div>',

            scope: {
                title: '@',
                data: '='
            },

            link: function (scope, element) {

                Highcharts.chart(element[0], {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: scope.title
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
                    series: [{
                        data: scope.data
                    }]
                });
            }
        };
    })

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
