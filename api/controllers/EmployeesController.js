/**
 * EmployeesController
 *
 * @description :: Server-side logic for managing employees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    getEmployeeAttributes : function( req, res ) {

        // Employees.getAllAttributes()

    },

    getEmployee : function( req, res ){  
        
        var employeeVal = (req.body.value) ? req.body.value : undefined;       

        EmployeesService.getEmployee(employeeVal, function( employee ){
            res.json(employee);
        });
    },

    getEmployeeList : function( req, res ){  
        EmployeesService.getEmployeeList(function( employees ){
            res.json(employees);
        });
    },

    saveEmployee: function(req, res) {     

        if ( req.param('id') ) {

            EmployeesService.editEmployee(req.param('employee'), req.param('id'), function(success) {
                if ( success ) {
                    res.json( { success : true , data : success  });                
                }
            }, function( xhr, errMsg ){
                res.json( { success : false , data : success  });                            
            }); 
        } else {           
            EmployeesService.saveEmployee(req.param('employee'), function(success) {
                if ( success ) {
                    res.json( { success : true , data : success  });                
                }
            }, function( xhr, errMsg ){
                res.json( { success : false , data : success  });                            
            });
        }

    },

    removeEmployee: function(req, res) {        
        
        var employeeVal = ( req.param('id') )  ? req.param('id') : undefined;

        EmployeesService.removeEmployee(employeeVal, function(success) {
            res.json( { success : true , data : success.id  });
        });
    }
	
};

