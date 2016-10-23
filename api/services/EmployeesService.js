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
        Employees.find().populate('time_records').exec(function( err, employees ) {

            if( err ) callback(err);

            sails.log('There are %d employee(s) fetched in the collection.', employees.length);

            callback(employees);
        });

    },
    
    getEmployee : function( criteria, callback ) {

        Employees.find({ empId : { 'contains': criteria } }, { fullName : { 'contains': criteria } }, { emailAddress : { 'contains': criteria } }, { position : { 'contains': criteria } })
            .exec(function( err, employees ) {

                if( err ) callback(err);

                callback(employees);
        });

    },

    saveEmployee : function ( data, callback ) {

        Employees.create( data ).exec(function( err, employee ){
            if( err ) throw err;

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