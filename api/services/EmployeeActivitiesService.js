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
			id : 0,
			empId : data.empId,
			description : data.description
		};
           
        Employee_activities.create(data).exec( function(err, result) {
            if ( err ) callback(err);

            callback(result);
        });   

    }
    
};