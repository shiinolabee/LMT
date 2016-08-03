/**
 * EmployeeService
 *
 * @description :: Server-side logic for managing Employees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {
    
    getEmployees : function( next ) {

        Employees.find().exec(function( err, todos ) {

            if( err ) throw err;

            next(todos);
        });

    },

    addEmployee : function ( data, next ) {

        Employees.create( data ).exec(function( err, todo ){
            if( err ) throw err;

            next(todo);
        });
    },

    remove : function( data, next) {

        Employees.destroy( data ).exec(function( err, todo ){
            if( err ) throw err;

            next(todo);
        });
    }
};