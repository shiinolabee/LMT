/**
 * Employee_time_record_settings.js
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

        startShiftTime : {
            type : 'timestamp',
            required : true
        },

        endShiftTime : {
            type : 'timestamp',
            required : true
        },

        departmentAssigned : {
            model : 'departments',
            unique : true
        }

    }
};

