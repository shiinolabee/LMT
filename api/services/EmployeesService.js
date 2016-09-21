/**
 * EmployeeService
 *
 * @description :: Server-side logic for managing Employees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {

    getSortingList : function( sortData, callback ){

        Employees.find({ sort : sortData.orderBy + ' ' + sortData.orderType }).exec(function( err, employees ) {        

            if( err ) callback(err);

            callback(employees);
        });
    },
    
    getEmployeeList : function( callback ) {

        // Employees.find().paginate({ page : pageValue , limit : limitValue}).exec(function( err, employees ) {
        Employees.find().exec(function( err, employees ) {

            if( err ) callback(err);

            callback(employees);
        });

    },
    
    getEmployee : function( criteria, callback ) {

        Employees.find({ where : { fullName : criteria, emailAddress : criteria, empId : criteria } }).exec(function( err, employees ) {

            if( err ) callback(err);

            callback(employees);
        });

    },

    saveEmployee : function ( data, callback ) {

        Employees.create( data ).exec(function( err, employee ){
            if( err ) callback(err);

            callback(employee);
        });
    },

    editEmployee : function ( data, id, callback ) {

        Employees.update( { id : id }, data ).exec(function( err, employee ){
            if( err ) callback(err);

            callback(employee);
        });
    },

    removeEmployee : function( id, callback) {

        Employees.destroy( { id : id } ).exec(function( err, employee ){
            if( err ) callback(err);

            callback(employee);
        });
    }
};