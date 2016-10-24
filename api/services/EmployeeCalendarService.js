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

            sails.log('There are %d calendar event(s) fetched in the collection.', result.length);

            callback(result);
        });

    },

    saveEmployeeEvent : function ( data, callback ) {       

        Employee_calendar.create( data ).exec(function( err, result ){
            if( err ) callback(err);

            sails.log('Calendar event details successfully saved in the collection.');            

            callback(result);
        });
    },

    editEmployeeEvent : function ( data, id, callback ) {

        Employee_calendar.update( { id : id }, data ).exec(function( err, result ){
            if( err ) callback(err);

            sails.log('Calendar event details successfully updated in the collection.');    
            callback(result);
        });
    },

    removeEmployeeEvent : function( id, callback) {

        Employee_calendar.destroy( { id : id } ).exec(function( err, result ){
            if( err ) callback(err);
            
            sails.log('Calendar event details successfully removed in the collection.');            

            callback(result);
        });
    }
};