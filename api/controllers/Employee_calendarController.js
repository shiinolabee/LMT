/**
 * Employee_calendarController
 *
 * @description :: Server-side logic for managing employee_calendars
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    getEmployeeEventList : function( req, res ){         

        EmployeeCalendarService.getEmployeeEventList(function( response ){

            if ( response ) {
                res.json( { success : true , data : response  });    
            } else {
                res.json(response.status, { success : false , data : "Error"  });                
            }  
        });
    },

    saveEmployeeEvent: function(req, res) {     

        if ( req.param('id') ) {

            EmployeeCalendarService.editEmployeeEvent(req.param('activeRecord'), req.param('id'), function(response) {                

                if ( response ) {
                    var responseData = response;
                    var id = req.param('userId');
                    var title =  "Calendar Event";
                    var description = "\"" + req.param('activeRecord').title + "\" event has been updated/changed.";

                    EmployeeActivitiesService.saveEmployeeActivity({ type: 5, empId : id, description : description, title : title }, function( response ){

                        if ( response ) {
                            return res.json( { success : true , data : responseData  });    
                        }
                    });                 
                } else {
                    res.json(response.status, { success : false , data : "Error"  });                
                }   
            }); 
        } else {           
            EmployeeCalendarService.saveEmployeeEvent(req.param('activeRecord'), function(response) {

                if ( response ) {
                    var responseData = response;
                    var id = req.param('userId');
                    var title =  "New Calendar Event";
                    var description = "\"" + req.param('activeRecord').title + "\" event has been registered.";

                    EmployeeActivitiesService.saveEmployeeActivity({ type: 5, empId : id, description : description, title : title }, function( response ){

                        if ( response ) {
                            return res.json( { success : true , data : responseData  });    
                        }
                    });                 
                } else {
                    res.json(response.status, { success : false , data : "Error"  });                
                }   
            });
        }

    },

    removeEmployeeEvent: function(req, res) {        
        
        var employeeVal = ( req.param('id') )  ? req.param('id') : undefined;

        EmployeeCalendarService.removeEmployeeEvent(employeeVal, function(response) {

           if ( response ) {
                var responseData = response;
                var id = req.param('userId');
                var title = "Remove Calendar Event";
                var description = "Event \"" + req.param('departmentName') + "\" has been removed.";

                EmployeeActivitiesService.saveEmployeeActivity({ type: 2, empId : id, description : description, title : title }, function( response ){

                    if ( response ) {
                        return res.json( { success : true , data : responseData  });    
                    }
                });                 
            } else {
                res.json(response.status, { success : false , data : "Error"  });                
            }  
        });
    }
};

