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
            unique : true,
            columnName : 'empId'
        },

        departmentAssigned : {
            model : 'departments'            
        },

        fullName : {
            type : 'string',
            defaultsTo : '',
            columnName : 'fullName'
        },

        gender: {
            type : 'integer'
        },

        homeAddress : {
            type : 'text'
        },

        position : {
            type : 'string'
        },

        dateHired : {
            type : 'date'
        },

        dateRegularized : {
            type: 'date'
        },

        contactNumber : {
            type : 'string'
        },        
         
        emailAddress : {
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
        }, 

        createdAt : {
            type : 'datetime',            
        },

        updatedAt : {
            type : 'datetime',            
        },

        time_records : {
            collection : 'Employee_time_records',
            via : 'empId'
        },

        //attribute methods
        getAllAttributes : function(){
            return this;
        },
    }
};

