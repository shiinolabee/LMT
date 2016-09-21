/**
 * Employee_time_recordsController
 *
 * @description :: Server-side logic for managing employee_time_records
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  	
  	saveEmployeeTimeRecord: function(req, res) {     

        if ( req.param('id') ) {

            EmployeesTimeRecordService.editEmployeeTimeRecord(req.param('activeRecord'), req.param('id'), function(response) {
                
                if ( response ) {
                    var responseData = response;
                    var id = req.param('id');
                    var description = "Updating Time Record " + new Date(req.param('activeRecord').startsAt).toLocalString();

                    EmployeeActivitiesService.saveEmployeeActivity({ empId : id, description : description }, function( response ){

                        if ( response ) {
                            return res.json( { success : true , data : responseData  });    
                        }
                    });                 
                } else {
                    res.json(response.status, { success : false , data : "Error"  });                
                }   
            }); 
        } else {           
            EmployeesTimeRecordService.saveEmployeeTimeRecord(req.param('activeRecord'), function(response) {
                
                if ( response ) {
                    var responseData = response;
                    var id = req.param('activeRecord').id;
                    var description = "Registered New Time Record " + new Date(req.param('activeRecord').startsAt).toLocalString() + " of Employee";

                    EmployeeActivitiesService.saveEmployeeActivity({ empId : id, description : description }, function( response ){

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

    removeEmployeeTimeRecord: function(req, res) {        
        
        var employeeVal = req.param('id') ? req.param('id') : undefined;

        EmployeesTimeRecordService.removeEmployeeTimeRecord(employeeVal, function(response) {
             if ( response ) {
                var responseData = response;
                var id = req.param('id');
                var description = "Deleting Time Record " + new Date(req.param('activeRecord').startsAt).toLocalString() + " of Employee";

                EmployeeActivitiesService.saveEmployeeActivity({ empId : id, description : description }, function( response ){

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

