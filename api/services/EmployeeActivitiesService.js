/**
 * EmployeeActivitiesService
 *
 * @description :: Server-side logic for managing Event Calendar records
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

var moment = require('moment');

module.exports = {

	getAllEmployeeActivities : function(lastActivityRecord, callback ){

		var lastActivityRecord = lastActivityRecord == null ? null : lastActivityRecord;		

		if ( lastActivityRecord !== 0 && moment(lastActivityRecord).isValid() ) {
			var lastActivityRecordDate = moment(lastActivityRecord);
			var last6days = moment(lastActivityRecord).subtract(8, 'days');		

			var query = {
				dateCommitted : { 
					'<' : lastActivityRecordDate.subtract(1, 'days').format('YYYY-MM-DD'),
					'>=' : last6days.format('YYYY-MM-DD')
				} 
			};		

		} else if ( lastActivityRecord == null ) {
			var currentDate = moment();
			var last6days = currentDate.subtract(6, 'days');					

			var query = {
				dateCommitted : { 
					'>=' : last6days.format('YYYY-MM-DD') 
				} 
			};				
		} else {
			var query = {
				type : 0
			};
		}

		Employee_activities.find({ where : query }, { sort : 'createdAt DESC' }).exec(function( err, activities ){

			if ( err ) callback(err);

            sails.log('There are %d activity(s) fetched in the collection.', activities.length);

            callback(activities);
		});

	},

	getEmployeeActivityList : function( id, callback ){

		Employee_activities.find({ where : { empId : id } }, { sort : 'createdAt DESC' }).exec(function( err, activities ){

			if ( err ) callback(err);

            sails.log('There are %d activity(s) fetched in the collection.', activities.length);			

			callback(activities);
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
           
        Employee_activities.create(record).exec( function(err, activities) {
            if ( err ) callback(err);

            sails.log('Activity details successfully saved in the collection.');            

            callback(activities);
        });   

    }
    
};