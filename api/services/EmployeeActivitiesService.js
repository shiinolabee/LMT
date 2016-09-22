/**
 * EmployeeActivitiesService
 *
 * @description :: Server-side logic for managing Event Calendar records
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {

	getAllEmployeeActivities : function( callback ){

		Employee_activities.find({ sort : 'createdAt DESC' }).exec(function( err, result ){

			if ( err ) callback(err);

			callback(result);
		});

	},

	getEmployeeActivityList : function( id, callback ){

		Employee_activities.find({ where : { empId : id, id: id }}).exec(function( err, result ){

			if ( err ) callback(err);

			callback(result);
		});

	},

	saveEmployeeActivity: function(data, callback) {   

		var record = {			
			userId : data.userId,
			empId : data.empId,
			title : data.title,
			description : data.description,
			type : data.type,
			dateCommitted : new Date()
		};
           
        Employee_activities.create(record).exec( function(err, result) {
            if ( err ) callback(err);

            callback(result);
        });   

    }
    
};