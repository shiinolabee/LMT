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
                
                var isSuccess = !response.status ? true : false;
           
                res.json( { success : isSuccess , data : response  });   
            }); 
        } else {           
            EmployeesTimeRecordService.saveEmployeeTimeRecord(req.param('activeRecord'), function(response) {
                
                var isSuccess = !response.status ? true : false;
           
                res.json( { success : isSuccess , data : response  }); 
            });
        }

    },

    removeEmployeeTimeRecord: function(req, res) {        
        
        var employeeVal = req.param('id') ? req.param('id') : undefined;

        EmployeesTimeRecordService.removeEmployeeTimeRecord(employeeVal, function(response) {
            res.json( { success : true , data : employeeVal  });
        });
    }
};

