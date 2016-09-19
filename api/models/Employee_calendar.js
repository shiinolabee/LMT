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
            length : 20,
        	defaulsTo : ''
        },

        description : {
        	type : 'text',
            defaulsTo : ''
        },

        type : {
        	type : 'integer',
        	defaulsTo : 0
        },

        startsAt : {
        	type : 'datetime'        	
        },

        endsAt : {
        	type : 'datetime'        	
        },

        recursOn: {
        	type : 'text'        	
        },

        applysToAll : {
        	type : 'string',
            length: 10,
            defaulsTo : '1'
        },

        // applysTo : {
        // 	type : 'json'
        // },

        createdAt : {
            type : 'datetime'         
        },

        updatedAt : {
            type : 'datetime'            
        }
  	}
};

