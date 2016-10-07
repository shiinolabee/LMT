/**
 * Employee_activitiesController
 *
 * @description :: Server-side logic for managing employee_activities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {	

	getEmployeeActivities : function( req, res ){

		if ( req.param('id') > 0 ) {
			EmployeeActivitiesService.getEmployeeActivityList(req.param('id'), function( response ){

				if ( response ) {
					res.json({ success : true, data : response });
				} else {
					res.json(response.status,{ success : false, message : "Error" });
				}

			});
		}

	},

	getAllEmployeeActivities : function( req, res ){
	
		EmployeeActivitiesService.getAllEmployeeActivities(req.param('lastActivityRecord'), function( response ){

			if ( response ) {
				res.json({ success : true, data : response });
			} else {
				res.json(response.status,{ success : false, message : "Error" });
			}

		});	

	}

};

