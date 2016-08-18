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
            model : 'employees',
            unique : true
        },

        remarks : {            
            type : 'text',
            required : false
        },

        dateAttended : {
            type : 'date',
            required : true,
        },

        time1 : {
            type : 'datetime',
            required : true,
            columnName : 'time_1'
        },
        
        time2 : {
            type : 'datetime',
            required : true,
            columnName : 'time_2'        
        },
        
        time3 : {
            type : 'datetime',
            required : true,
            columnName : 'time_3'        
        },
        
        time4 : {
            type : 'datetime',
            required : true,
            columnName : 'time_4'        
        },
        
        time5 : {
            type : 'datetime',
            required : true,
            columnName : 'time_5'        
        },
        
        time6 : {
            type : 'datetime',
            required : true,
            columnName : 'time_6'        
        }

    }
};

