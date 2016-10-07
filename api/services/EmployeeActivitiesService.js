/**
 * EmployeeActivitiesService
 *
 * @description :: Server-side logic for managing Event Calendar records
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

var moment = require('moment');

module.exports = {

	getAllEmployeeActivities : function(lastActivityRecord, callback ){

		var lastActivityRecord = lastActivityRecord || null;

		console.log(lastActivityRecord);

		if ( moment(lastActivityRecord).isValid() ) {
			var lastActivityRecordDate = moment(lastActivityRecord);
			var last6days = moment(lastActivityRecord).subtract(8, 'days');		

			var query = {
				dateCommitted : { 
					'<' : lastActivityRecordDate.subtract(1, 'days').format('YYYY-MM-DD'),
					'>=' : last6days.format('YYYY-MM-DD')
				} 
			};		
			

		} else {
			var currentDate = moment();
			var last6days = currentDate.subtract(6, 'days');					

			var query = {
				dateCommitted : { 
					'>=' : last6days.format('YYYY-MM-DD') 
				} 
			};				
		}

		console.log(query)

		Employee_activities.find({ where : query }, { sort : 'createdAt DESC' }).exec(function( err, result ){

			if ( err ) callback(err);

			callback(result);
		});

	},

	getEmployeeActivityList : function( id, callback ){

		Employee_activities.find({ where : { empId : id } }, { sort : 'createdAt DESC' }).exec(function( err, result ){

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