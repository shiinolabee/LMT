/**
 * Employee_calendar.js
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

        title : {
        	type : 'string',
        	defaulsTo : ''
        },

        description : {
        	type : 'text',
        	required : false
        },

        type : {
        	type : 'integer',
        	defaulsTo : 0,
        	required : true
        },

        startsAt : {
        	type : 'datetime',
        	required : true
        },

        endsAt : {
        	type : 'datetime',
        	required : true	
        },

        isRecursive: {
        	type : 'integer',
        	required : true
        },

        applysToAll : {
        	type : 'integer'
        },

        applysTo : {
        	type : 'json'
        },

        createdAt : {
            type : 'datetime',            
        },

        updatedAt : {
            type : 'datetime',            
        }
  	}
};

