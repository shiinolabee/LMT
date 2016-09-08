/**
 * Employee_time_recordsController
 *
 * @description :: Server-side logic for managing employee_time_records
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  	
  	saveEmployeeTimeRecord: function(req, res) {     

        if ( req.param('id') ) {

            EmployeesTimeRecordService.editEmployeeTimeRecord(req.param('activeRecord'), req.param('id'), function(success) {
                if ( success ) {
                    res.json( { success : true , data : success  });                
                }
            }, function( xhr, errMsg ){
                res.json( { success : false , data : success  });                            
            }); 
        } else {           
            EmployeesTimeRecordService.saveEmployeeTimeRecord(req.param('activeRecord'), function(success) {
                if ( success ) {
                    res.json( { success : true , data : success  });                
                }
            }, function( xhr, errMsg ){
                res.json( { success : false , data : success  });                            
            });
        }

    },

    removeEmployeeTimeRecord: function(req, res) {        
        
        var employeeVal = req.param('id') ? req.param('id') : undefined;

        EmployeesTimeRecordService.removeEmployeeTimeRecord(employeeVal, function(success) {
            res.json( { success : true , data : success.id  });
        });
    }
};

