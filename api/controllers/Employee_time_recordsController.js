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
                    var title = "Time Records";
                    var description = "Time Record \"" + new Date(req.param('activeRecord').startsAt).toLocaleString() + "\" of Employee ID " + req.param('activeRecord').empId + " has been updated.";

                    EmployeeActivitiesService.saveEmployeeActivity({ type: 2.1, empId : id, description : description, title : title }, function( response ){

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
                    var title = "Time Records";
                    var description = "New Time Record \"" + new Date(req.param('activeRecord').startsAt).toLocaleString() + "\" of Employee ID " + responseData.empId + " has been registered.";

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

    },

    removeEmployeeTimeRecord: function(req, res) {        
        
        var employeeVal = req.param('id') ? req.param('id') : undefined;

        EmployeesTimeRecordService.removeEmployeeTimeRecord(employeeVal, function(response) {
            if ( response ) {
                var responseData = response;
                var id = req.param('id');
                var title = "Time Record of " + req.param('fullName') + " - " + req.param('empId');
                var description = "Time Record \"" + new Date(response.startsAt).toLocaleString() + "\" has been removed from his/her record.";

                EmployeeActivitiesService.saveEmployeeActivity({ type: 2.2, empId : id, description : description, title : title }, function( response ){

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

