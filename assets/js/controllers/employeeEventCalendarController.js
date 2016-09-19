var employeeEventCalendarController = function( $scope, activeRecordService, $uibModal, moment , calendarConfig){

	var _self = this;

	_self.events = [];

	_self.showLoader = false;

	_self.eventTypes = [
    	// { text : 'Select Record Type', value : 0 },
    	{ text : 'Regular Holiday', value : 1 },
    	{ text : 'Working Holiday', value : 2 },
    	{ text : 'Special Non-Working Holiday', value : 3 },
    	{ text : 'Special Working Holiday', value : 4 }
    ];		        

	_self.initEvent = function( isEditMode, index ){

        if ( !isEditMode && index == 0 ) {
			var event = {
				id : 0,
				title : '',
				description : '',
				type : 0,
				startsAt : '',
				endsAt : '',
				recursOn : 'Yearly',				
				applysToAll : 1
			};        	
		} else {                
            var event = angular.copy(_self.events[index]);
        }

		return event;
	};

	$scope.employeeEventCalendarAlerts = [];		

   	$scope.addAlert = function(type, options) {
        _self[type].push(options);
    };

    $scope.closeAlert = function(type, index) {
        _self[type].splice(index, 1);
    };


    // _self.getCalendarEventsFromGoogle = function(){

    // 	calendarService.getSearchYoutube().then(function( response ){
    // 		console.log(response)
    // 	})

    // };

    // _self.getCalendarEventsFromGoogle();

	var actions = [{
      label: '<i class=\'glyphicon glyphicon-pencil\'></i>',

      onClick: function(args) {

        console.log('Editing Event Record : ', args.calendarEvent); 

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

        activeRecordService.removeActiveRecord(args.calendarEvent.id, 'employee_calendar/removeEmployeeEvent').then(function( response ){
        	if ( response.success ) {
        		console.info('Deleted Event Record : ', args.calendarEvent);
        		_self.events.splice(_self.events.indexOf(args.calendarEvent), 1);                    		
        		
        		$scope.addAlert('employeeEventCalendarAlerts', {
                    type: 'info',
                    msg: 'Event Record Details \'' + args.calendarEvent.startsAt.toUTCString() + '\' Successfully Deleted'
                }); 

        	}
        });

      }

    }];	

	_self.externalEvents = [
      {
        title: 'Event 1',
        type: 'warning',
        color: calendarConfig.colorTypes.warning,
        startsAt: moment().startOf('month').toDate(),
        draggable: true
      },
      {
        title: 'Event 2',
        type: 'danger',
        color: calendarConfig.colorTypes.important,
        startsAt: moment().startOf('month').toDate(),
        draggable: true
      }
    ];     

    _self.eventTempObj = {
    	title : 'Event' ,
    	color : calendarConfig.colorTypes.info,
    	type : 'info',
    	startsAt : '',
    	endsAt : '',
	 	draggable: true,
	 	incrementsBadgeTotal: true,
        resizable: false,
        actions: actions
    };


    _self.calendarView = 'month';
    _self.viewDate = moment().startOf('month').toDate();
    _self.isCellOpen = true;

  	_self.mergeObjects = function( obj1, obj2 ){
        	var obj3 = {};
		    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
		    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
	    return obj3;
    };

    _self.saveEvent = function( index, isEditMode ){

    	var modalInstance = $uibModal.open({
    		animation : true,
    		backdrop : false,
    		keyboard : false,

    		templateUrl : 'templates/employees/event-record-form.html',

    		size : 'lg',

    		bindToController : true,

    		resolve : {
    			getIsEditMode : function(){
    				return isEditMode;
    			},
    			getIndex : function(){
    				return index;
    			},
    			initEvent : function(){
    				return _self.initEvent(isEditMode, index);
    			},
    			geteventTypes : function(){
    				return _self.eventTypes;
    			}
    		},

    		controller : function( $scope, getIsEditMode, getIndex, initEvent, geteventTypes ){

    			$scope.isEditMode = getIsEditMode;
    			$scope.index = getIndex;
    			$scope.eventTypes = geteventTypes;
    			$scope.event = initEvent;
    			$scope.event_datePicker = {};

   				$scope.toggle = function($event, field, event) {

			      	$event.preventDefault();
				    $event.stopPropagation();
				    event[field] = !event[field];
			    };

    			$scope.modalOptions = {
    				headerText : !getIsEditMode ? 'Create New Event' : 'Edit Event ',
                    closeButtonText : 'Cancel',
                    actionButtonText : !getIsEditMode ? 'Save' : 'Save changes',

                    ok : function( result ){

                    	var responseData;

                    	console.log($scope.event, $scope.isEditMode);

                    	activeRecordService.saveActiveRecord($scope.event, $scope.isEditMode, 'employee_calendar/saveEmployeeEvent').then(function( response ){
	                    	if ( response ) {
	                    		responseData = response;		                    						              
	                    	}
	                    });

	                    modalInstance.close(responseData)
                    },

                    close : function(){                                                    
                        modalInstance.dismiss('cancel');                            
                    }  
    			};
    		},

    		controllerAs : 'createEventCtrl'
    	});

    	modalInstance.result.then(function( response ){

    		if ( response.success ) {
			 	var newEvent = _self.mergeObjects(response.data, _self.eventTempObj);

    			_self.externalEvents.push(newEvent);	    			   	
             	_self.events.push(newEvent);				                 	
        		
        		$scope.addAlert('employeeEventCalendarAlerts', {
                    type: 'success',
                    msg: 'Event Record Details \'' + newCalendarEvent.startsAt.toUTCString() + '\' Successfully Saved'
                }); 
    		}

    	})

    };

    _self.removeEvent = function(){

    }

    _self.eventDropped = function(event, start, end) {

      	var externalIndex = _self.externalEvents.indexOf(event);

      	if (externalIndex > -1) {
        	_self.externalEvents.splice(externalIndex, 1);
        	_self.events.push(event);
      	}

      	event.startsAt = start;
	    if (end) {
      		event.endsAt = end;
	    }
    };  


};

cereliApp.controller('employeeEventCalendarController', employeeEventCalendarController);

employeeEventCalendarController.$inject = [ '$scope', 'activeRecordService', '$uibModal', 'moment', 'calendarConfig' ];