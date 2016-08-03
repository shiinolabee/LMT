/**
 * Company_details.js
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

        companyName : {
            type : 'text'
        },

        companyAddress : {
            type: 'text'
        },

        contactNo : {
            type : 'string'
        },

        systemBuildVersion : {
            type : 'float'
        }

    }
};

