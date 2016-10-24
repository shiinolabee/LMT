/**
 * EmployeeTimeRecordService
 *
 * @description :: Server-side logic for managing Employees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {
    
    getEmployeeTimeRecordList : function( callback ) {

        Employee_time_records.find().exec(function( err, time_records ) {

            if( err ) callback(err);

            sails.log('There are %d time_records time record(s) fetched in the collection.', time_records.length);

            callback(time_records);
        });

    },
    
    getEmployeeTimeRecord : function( id, callback ) {

        Employee_time_records.find({ where : { empId : id } }  ).exec(function( err, time_records ) {

            if( err ) callback(err);

            sails.log('Searched time record(s) successfully fetched in the collection.');

            callback(time_records);
        });

    },

    saveEmployeeTimeRecord : function ( data, callback ) {       

        Employee_time_records.create( data ).exec(function( err, time_records ){
            if( err ) callback(err);

            sails.log('Time record details successfully saved in the collection.');            

            callback(time_records);
        });
    },

    editEmployeeTimeRecord : function ( data, id, callback ) {

        Employee_time_records.update( { id : id }, data ).exec(function( err, time_records ){
            if( err ) callback(err);

            sails.log('Time record details successfully updated in the collection.');   

            callback(time_records);
        });
    },

    removeEmployeeTimeRecord : function( id, callback) {

        Employee_time_records.destroy( { id : id } ).exec(function( err, time_records ){
            if( err ) callback(err);

            sails.log('Time record details successfully removed in the collection.'); 

            callback(time_records);
        });
    }
};