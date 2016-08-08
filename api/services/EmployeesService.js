/**
 * EmployeeService
 *
 * @description :: Server-side logic for managing Employees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {
    
    getEmployeeList : function( next ) {

        Employees.find().exec(function( err, employees ) {

            if( err ) throw err;

            next(employees);
        });

    },
    
    getEmployee : function( data, next ) {

        Employees.find(data).exec(function( err, employees ) {

            if( err ) throw err;

            next(employees);
        });

    },

    saveEmployee : function ( data, next ) {

        Employees.create( data ).exec(function( err, todo ){
            if( err ) throw err;

            next(todo);
        });
    },

    editEmployee : function ( data, next ) {

        Employees.update( data ).exec(function( err, todo ){
            if( err ) throw err;

            next(todo);
        });
    },

    removeEmployee : function( id, next) {

        Employees.destroy( { id : id } ).exec(function( err, todo ){
            if( err ) throw err;

            next(todo);
        });
    }
};