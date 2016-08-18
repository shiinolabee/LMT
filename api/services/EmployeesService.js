/**
 * EmployeeService
 *
 * @description :: Server-side logic for managing Employees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {
    
    getEmployeeList : function( next ) {

        // Employees.find().paginate({ page : pageValue , limit : limitValue}).exec(function( err, employees ) {
        Employees.find().exec(function( err, employees ) {

            if( err ) throw err;

            next(employees);
        });

    },
    
    getEmployee : function( criteria, next ) {

        Employees.find({ where : { fullName : criteria, emailAddress : criteria, empId : criteria } }).exec(function( err, employees ) {

            if( err ) throw err;

            next(employees);
        });

    },

    saveEmployee : function ( data, next ) {

        Employees.create( data ).exec(function( err, employee ){
            if( err ) throw err;

            next(employee);
        });
    },

    editEmployee : function ( data, id, next ) {

        Employees.update( { id : id }, data ).exec(function( err, employee ){
            if( err ) throw err;

            next(employee);
        });
    },

    removeEmployee : function( id, next) {

        Employees.destroy( { id : id } ).exec(function( err, employee ){
            if( err ) throw err;

            next(employee);
        });
    }
};