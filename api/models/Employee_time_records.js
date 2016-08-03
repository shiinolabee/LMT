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
        employeeId : {            
            model : 'employees',
            unique : true
        },

        remarks : {            
            type : 'text',
            required : false
        },

        dateAttended : {
            type : 'date',
            required : true
        },

        time1 : {
            type : 'datetime',
            required : true
        },
        
        time2 : {
            type : 'datetime',
            required : true        
        },
        
        time3 : {
            type : 'datetime',
            required : true        
        },
        
        time4 : {
            type : 'datetime',
            required : true        
        },
        
        time5 : {
            type : 'datetime',
            required : true        
        },
        
        time6 : {
            type : 'datetime',
            required : true        
        }

    }
};

