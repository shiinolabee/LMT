/**
 * EmployeeCalendarService
 *
 * @description :: Server-side logic for managing Event Calendar records
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {
    
    getEmployeeList : function( callback ) {

        Employee_calendar.find().exec(function( err, result ) {

            if( err ) callback(err);

            callback(result);
        });

    },

    saveEmployeeEvent : function ( data, callback ) {

        Employee_calendar.create( data ).exec(function( err, result ){
            if( err ) callback(err);

            callback(result);
        });
    },

    editEmployeeEvent : function ( data, id, callback ) {

        Employee_calendar.update( { id : id }, data ).exec(function( err, result ){
            if( err ) callback(err);

            callback(result);
        });
    },

    removeEmployeeEvent : function( id, callback) {

        Employee_calendar.destroy( { id : id } ).exec(function( err, result ){
            if( err ) callback(err);

            callback(result);
        });
    }
};