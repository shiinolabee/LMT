/**
 * Employee_activities.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    schema : true,

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

        type : {
            type : 'text',
            required : false
        },

        dateCommitted : {
            type : 'datetime',
            required : true
        },

        remarks : {
            type : 'text'
        },

        status : {
            type : 'integer',
            defaultsTo : 0
        }

    }
};

