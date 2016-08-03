/**
 * Employees.js
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

        empId : {
            type : 'integer',
            unique : true
        },

        fullName : {
            type : 'string'            
        },

        position : {
            type : 'string'
        },

        contactNumber : {
            type : 'string'
        },        

        paidLeaveLimit : {
            type : 'text'
        },

        unpaidLeaveLimit : {
            type : 'text'
        },

        noOfAbsences : {
            type : 'text'
        },

        noOfLates : {
            type : 'text'
        },

        totalOvertime : {
            type : 'text'
        },

        recordStatus : {
            type : 'integer',
            defaultsTo : 0
        }

    }
};

