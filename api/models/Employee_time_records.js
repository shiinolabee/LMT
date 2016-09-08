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

        dateAttended : {
            type : 'date',
            required : true,
        },

        time: {            
            type : 'string',
            size : 20,
            unique : true,
            required : true,
            columnName : 'time'
        }      
    }
};

