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

        var employeeVal = (req.body.value) ? req.body.value : undefined;       
       
        EmployeesService.saveEmployee(employeeVal, function(success) {
            res.json(success);
        });

    },

    removeEmployee: function(req, res) {        
        
        var employeeVal = ( req.param('empId') )  ? req.param('empId') : undefined;

        EmployeesService.removeEmployee(employeeVal, function(success) {
            res.json(success);
        });
    }
	
};

