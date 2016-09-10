/**
 * Employee_time_records.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    schema: true,
    
    attributes: {

        id: {
            type: 'integer',
            unique: true,
            primaryKey: true,
            columnName: 'id'
        },

        //reference for employees collection
        empId : {                        
            model : 'employees'                        
        },

        remarks : {            
            type : 'text'
        },     

        startsAt : {
            type : 'datetime'
        },

        endsAt : {
            type : 'datetime'
        },

        timeRecordType : {
            type : 'integer',
            defaultsTo : 1
        },

        createdAt : {
            type : 'datetime'            
        },

        updatedAt : {
            type : 'datetime'            
        }
    }
};

