/**
 * EmployeeTimeRecordService
 *
 * @description :: Server-side logic for managing Employees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {
    
    getEmployeeTimeRecordList : function( callback ) {

        // Employees.find().paginate({ page : pageValue , limit : limitValue}).exec(function( err, employees ) {
        Employee_time_records.find().exec(function( err, employees ) {

            if( err ) callback(err);

            callback(employees);
        });

    },
    
    getEmployeeTimeRecord : function( id, callback ) {

        Employee_time_records.find({ where : { empId : id } }  ).exec(function( err, employees ) {

            if( err ) callback(err);

            callback(employees);
        });

    },

    saveEmployeeTimeRecord : function ( data, callback ) {       

        Employee_time_records.create( data ).exec(function( err, employee ){
            if( err ) callback(err);

            callback(employee);
        });
    },

    editEmployeeTimeRecord : function ( data, id, callback ) {

        Employee_time_records.update( { id : id }, data ).exec(function( err, employee ){
            if( err ) callback(err);

            callback(employee);
        });
    },

    removeEmployeeTimeRecord : function( id, callback) {

        Employee_time_records.destroy( { id : id } ).exec(function( err, employee ){
            if( err ) callback(err);

            callback(employee);
        });
    }
};