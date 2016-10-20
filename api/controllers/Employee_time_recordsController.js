/**
 * Employee_time_recordsController
 *
 * @description :: Server-side logic for managing employee_time_records
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var responseDataList = []; 

var moment = require('moment');

module.exports = {

    uploadTimeRecord : function( req, res ){

        req.file('file').upload({            
            maxBytes: 10000000, // don't allow the total upload size to exceed ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/uploads'),
            adapter: require('skipper-csv'),
            csvOptions: {delimiter: ',', columns: true},
            rowHandler: function(row, fd){    

                var tempTimeRecord = {        
                    id : 0,            
                    empId : 0,   
                    remarks : '',
                    startsAt : '',
                    date : '',
                    endsAt : '',
                    timeRecordType : 1                    
                };

                var tempArray = [];                

                Object.keys(row).forEach(function(key){

                    var rowValueLength = row[key].length;
                    
                    // console.log('row Length : ' + row[key].length, row[key]);

                    if ( row[key] != '' && row[key] != '1' && row[key] != '0' && (rowValueLength >= 4 || rowValueLength >= 5) ) {
                                                                 
                        var parseIntValue = parseInt(row[key]) || 0;
                        
                        if ( parseIntValue != 0 ) {                            
                            tempArray.push(row[key]);
                        }
                    }                    
                });

                // console.log('Temp Array : ', tempArray);

                if ( tempArray.length >= 4 ) {
                    tempArray.forEach(function( item, index ){ 

                        //remove pretenders :)
                        if ( item.length == 5 ) {
                            tempArray.splice(index, 1);
                        }
                    });                        
                }


                if ( tempArray.length > 0) { 

                    var startsAtDate = new Date();          
                    var dateAttended = tempArray.length >= 2 ? new Date(tempArray[1].replace(new RegExp('/', 'g'),'-')) : new Date();


                    tempTimeRecord.empId = parseInt(tempArray[0]);
                    
                    startsAtDate.setFullYear(dateAttended.getFullYear());
                    startsAtDate.setMonth(dateAttended.getMonth());
                    startsAtDate.setDate(dateAttended.getDate());

                    tempTimeRecord.date = startsAtDate;
                    
                    if ( tempArray.length >= 3 ) {
                        
                        var concatTimeString = tempArray[2].split(':');
                        startsAtDate.setHours(concatTimeString[0]);
                        startsAtDate.setMinutes(concatTimeString[1]);                        

                        if ( concatTimeString.length > 2 ) startsAtDate.setSeconds(concatTimeString[2]);

                    } else {
                        startsAtDate.setHours(0);
                        startsAtDate.setMinutes(0);
                        startsAtDate.setSeconds(0);  
                    }
                    
                    tempTimeRecord.startsAt = startsAtDate;  

                    var endsAtDate = new Date(startsAtDate);

                    endsAtDate.setHours(startsAtDate.getHours() + 1);                  

                    tempTimeRecord.endsAt = endsAtDate;                           
                  
                    EmployeesTimeRecordService.saveEmployeeTimeRecord(tempTimeRecord, function( response ){
                        responseDataList.push(response);                 
                    });
                }
                

            },

        }, function whenDone( err, uploadedFiles ){

            if ( err ) {
                return res.negotiate(err);   
            }

            var splittedFilename = uploadedFiles[0].filename.split('.');

            var id = req.param('userId');
            var title =  splittedFilename[0] + " Records";
            var description = "File " + uploadedFiles[0].filename + " has been successfully imported.";

            EmployeeActivitiesService.saveEmployeeActivity({ type : 0, userId : id, description : description, title : title }, function( response ){

                if ( response ) {

                    return res.json({
                        success : true,
                        message : 'Time record file ' + uploadedFiles[0].filename + ' successfully imported '+ responseDataList.length +' records.',
                        files : uploadedFiles,
                        data : responseDataList
                    });
                }
            });


        });

    },


    getEmployeeStatisticsReport : function( req, res ){

        if ( req.param('id') ) {

            var id = req.param('id');
            var selectedDate = moment(req.param('date'));
            var lastDayofSelectedDate = moment(req.param('date')).date(selectedDate.daysInMonth());

            console.log(selectedDate.format('YYYY-MM-DD hh:mm:ss'), lastDayofSelectedDate.format('YYYY-MM-DD hh:mm:ss'));

            Employee_time_records.find({ where : { empId : id, startsAt : { '>=': selectedDate.format('YYYY-MM-DD hh:mm:ss'), '<': lastDayofSelectedDate.format('YYYY-MM-DD hh:mm:ss') }, date: { '>=': selectedDate.format('YYYY-MM-DD'), '<': lastDayofSelectedDate.format('YYYY-MM-DD') } } })/*.max('startsAt')*/
                .then(function( result ){
                res.json({ success : true, data : result });
            });                  

        }

    },
  	
  	saveEmployeeTimeRecord: function(req, res) {     

        if ( req.param('id') ) {

            EmployeesTimeRecordService.editEmployeeTimeRecord(req.param('activeRecord'), req.param('id'), function(response) {
                
                if ( response ) {
                    var responseData = response;                    
                    var title = "Time Records";
                    var description = "Time Record \"" + new Date(req.param('activeRecord').startsAt).toLocaleString() + "\" of Employee ID " + req.param('activeRecord').empId + " has been updated.";

                    EmployeeActivitiesService.saveEmployeeActivity({ type: 2.1, empId : response.empId, description : description, title : title }, function( response ){

                        if ( response ) {
                            return res.json( { success : true , data : responseData  });    
                        }
                    });                 
                } else {
                    res.json(response.status, { success : false , data : "Error"  });                
                }   
            }); 
        } else {           
            EmployeesTimeRecordService.saveEmployeeTimeRecord(req.param('activeRecord'), function(response) {
                
                if ( response ) {
                    var responseData = response;                    
                    var title = "Time Records";
                    var description = "New Time Record \"" + new Date(req.param('activeRecord').startsAt).toLocaleString() + "\" of Employee ID " + responseData.empId + " has been registered.";

                    EmployeeActivitiesService.saveEmployeeActivity({ type: 2, empId : response.empId, description : description, title : title }, function( response ){

                        if ( response ) {
                            return res.json( { success : true , data : responseData  });    
                        }
                    });                 
                } else {
                    res.json(response.status, { success : false , data : "Error"  });                
                }   
            });
        }

    },

    removeEmployeeTimeRecord: function(req, res) {        
        
        var employeeVal = req.param('id') ? req.param('id') : undefined;

        EmployeesTimeRecordService.removeEmployeeTimeRecord(employeeVal, function(response) {
            if ( response ) {
                var responseData = response;                
                var title = "Time Record of " + req.param('fullName') + " - " + req.param('empId');
                var description = "Time Record \"" + new Date(response[0].startsAt).toDateString() + "\" has been removed from his/her record.";

                EmployeeActivitiesService.saveEmployeeActivity({ type: 2.2, empId : response[0].id, description : description, title : title }, function( response ){

                    if ( response ) {
                        return res.json( { success : true , data : responseData  });    
                    }
                });                 
            } else {
                res.json(response.status, { success : false , data : "Error"  });                
            }   
        });
    }
};

