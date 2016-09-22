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
            model : 'employees'            
        },

        userId : {
            model : 'user'
        },

        type : {
            type : 'float'
        },

        title : {
            type : 'text',
            required : false
        },     

        description : {
            type : 'text',
            required : false
        },     

        dateCommitted : {
            type : 'date',
        },

        createdAt : {
            type : 'datetime'         
        },

        updatedAt : {
            type : 'datetime'            
        }

    }
};

