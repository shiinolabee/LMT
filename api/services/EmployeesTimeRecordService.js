/**
 * EmployeeTimeRecordService
 *
 * @description :: Server-side logic for managing Employees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {
    
    getEmployeeTimeRecordList : function( next ) {

        // Employees.find().paginate({ page : pageValue , limit : limitValue}).exec(function( err, employees ) {
        Employee_time_records.find().exec(function( err, employees ) {

            if( err ) throw err;

            next(employees);
        });

    },
    
    getEmployeeTimeRecord : function( id, next ) {

        Employee_time_records.find({ where : { empId : id } }  ).exec(function( err, employees ) {

            if( err ) throw err;

            next(employees);
        });

    },

    saveEmployeeTimeRecord : function ( data, next ) {

        console.log(data);

        Employee_time_records.create( data ).exec(function( err, employee ){
            if( err ) throw err;

            next(employee);
        });
    },

    editEmployeeTimeRecord : function ( data, id, next ) {

        Employee_time_records.update( { id : id }, data ).exec(function( err, employee ){
            if( err ) throw err;

            next(employee);
        });
    },

    removeEmployeeTimeRecord : function( id, next) {

        Employee_time_records.destroy( { id : id } ).exec(function( err, employee ){
            if( err ) throw err;

            next(employee);
        });
    }
};