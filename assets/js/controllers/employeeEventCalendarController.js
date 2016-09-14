cereliApp
	.controller('employeeEventCalendarController', [ '$scope', 'activeRecordService', '$uibModal', 'moment', 'calendarConfig', 
		function( $scope, activeRecordService, $uibModal, moment , calendarConfig){

		var _self = this;

		_self.events = [];

		_self.employeeEventCalendarAlerts = [];		

		_self.showLoader = false;

		_self.initEvent = function(){

			var event = {
				id : 0,
				title : '',
				description : '',
				type : 0,
				startsAt : '',
				endsAt : '',
				isRecursive : 0,
				applysTo : '',
				applysToAll : 1
			};

			return event;
		};

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
	    			isEditMode : function(){
	    				return isEditMode;
	    			},
	    			getIndex : function(){
	    				return index;
	    			}
	    		},

	    		controller : function( $scope, isEditMode, getIndex ){

	    			$scope.isEditMode = isEditMode;
	    			$scope.index = getIndex;

	    			$scope.modalOptions = {
	    				headerText : 'Create New Event',
                        closeButtonText : 'Cancel',
                        actionButtonText : 'Close',

                        ok : function( result ){

                        	activeRecordService.saveActiveRecord(_self.event_record, _self.isEditMode, 'employee_calendar/saveEmployeeEvent').then(function( response ){
		                    	if ( response.success ) {

		                    		if ( !_self.isEditMode ) _self.events.push(newCalendarEvent);                    		
				                 	
				                 	_self.timeRecordSelected = false;	

				                 	var eventIndex = _self.externalEvents.indexOf(oldCalendarEvent);

				                 	_self.externalEvents[eventIndex] = newCalendarEvent;				                 	
		                    		
		                    		$scope.addAlert('employeeEventCalendarAlerts', {
		                                type: 'success',
		                                msg: 'Event Record Details \'' + newCalendarEvent.startsAt.toUTCString() + '\' Successfully Saved'
		                            }); 
		                    	}
		                    });
                        },

                        close : function(){                                                    
                            modalInstance.close();                            
                        }  
	    			};
	    		},

	    		controllerAs : 'createEventCtrl'
	    	});

	    	modalInstance.result.then(function( response ){

	    		if ( response.success ) {
    			 	var newEvent = _self.mergeObjects(response.data, _self.eventTempObj);

	    			_self.externalEvents.push(newEvent);
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


	} ]);