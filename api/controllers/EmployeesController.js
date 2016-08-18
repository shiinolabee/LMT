/**
 * EmployeesController
 *
 * @description :: Server-side logic for managing employees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    getEmployeeAttributes : function( req, res ) {

        return Employees.getAllAttributes();       

    },

    getEmployee : function( req, res ){  
        
        var criteria = (req.param('criteria')) ? req.param('criteria') : undefined;       

        EmployeesService.getEmployee(criteria, function( employee ){
            res.json(employee);
        });
    },

    getEmployeeList : function( req, res ){  

        // var limitValue = req.param('limit');
        // var pageValue = req.param('page');

        EmployeesService.getEmployeeList(function( employees ){
            if ( employees ) {
                res.json({ success : true, data : employees});                
            }
        });
    },

    saveEmployee: function(req, res) {     

        if ( req.param('id') ) {

            EmployeesService.editEmployee(req.param('activeRecord'), req.param('id'), function(success) {
                if ( success ) {
                    res.json( { success : true , data : success  });                
                }
            }, function( xhr, errMsg ){
                res.json( { success : false , data : success  });                            
            }); 
        } else {           
            EmployeesService.saveEmployee(req.param('activeRecord'), function(success) {
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

