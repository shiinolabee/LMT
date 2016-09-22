/**
 * EmployeesController
 *
 * @description :: Server-side logic for managing employees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var responseDataList = []; 

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

                console.log('Temp Array : ', tempArray);

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

                    console.log(tempTimeRecord);
                  
                    EmployeesTimeRecordService.saveEmployeeTimeRecord(tempTimeRecord, function( response ){
                        responseDataList.push(response);                 
                    });
                }
                

            },

        }, function whenDone( err, uploadedFiles ){

            if ( err ) {
                return res.negotiate(err);   
            }

            var id = req.param('userId');
            var title = "Time Records";
            var description = "File " + uploadedFiles[0].filename + " has been successfully imported.";

            EmployeeActivitiesService.saveEmployeeActivity({ type : 0, empId : id, description : description, title : title }, function( response ){

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

            Employee_time_records.find({ where : { empId : id } }, { sum : 'recordValue' }).groupBy('date').max('startsAt')
                .then(function( result ){
                res.json({ success : true, data : result });
            });                  

        }

    },

    getEmployeeTimeRecord : function( req, res ){

        EmployeesTimeRecordService.getEmployeeTimeRecord(req.param('id'),function( response ){

            if ( response ) {
                res.json( { success : true , data : response  });    
            } else {
                res.json(response.status, { success : false , data : "Error"  });                
            } 
           
        });
    },

    getEmployeeAttributes : function( req, res ) {

        return Employees.getAllAttributes();       

    },

    getEmployee : function( req, res ){  
        
        var criteria = (req.param('criteria')) ? req.param('criteria') : undefined;       

        EmployeesService.getEmployee(criteria, function( response ){
            res.json(response);
        });
    },

    sortBy : function( req, res ){

        var data = req.param('data');

        EmployeesService.getSortingList(data, function( response ){
            if ( response ) {
                res.json({ success :true, data : response });
            }
        });

    },

    getEmployeeList : function( req, res ){         

        EmployeesService.getEmployeeList(function( response ){

            if ( response ) {
                res.json( { success : true , data : response  });    
            } else {
                res.json(response.status, { success : false , data : "Error"  });                
            }  
        });
    },

    saveEmployee: function(req, res) {     

        if ( req.param('id') ) {

            EmployeesService.editEmployee(req.param('activeRecord'), req.param('id'), function(response) {                

                if ( response ) {

                    var responseData = response;
                    var id = req.param('id');
                    var title = "Employee ID " + req.param('activeRecord').empId;
                    var description = req.param('activeRecord').fullName + "\'s Details has been updated.";

                    EmployeeActivitiesService.saveEmployeeActivity({ type : 1.1, empId : id, description : description, title : title }, function( response ){

                        if ( response ) {
                            return res.json( { success : true , data : responseData  });    
                        }
                    });

                } else {
                    res.json(response.status, { success : false , data : "Error"  });                
                }    
            }); 
        } else {           
            EmployeesService.saveEmployee(req.param('activeRecord'), function(response) {

                if ( response ) {
                    var responseData = response;
                    var id = response.data.id;
                    var title = "New Employee";
                    var description = req.param('activeRecord').fullName + "'s details has been registered.";

                    EmployeeActivitiesService.saveEmployeeActivity({ type : 1, empId : id, description : description, title : title }, function( response ){

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

    removeEmployee: function(req, res) {        
        
        var employeeVal = ( req.param('id') )  ? req.param('id') : undefined;

        EmployeesService.removeEmployee(employeeVal, function(response) {

            if ( response ) {
                var responseData = response;
                var id = req.param('id');
                var title = "Remove Employee";
                var description = req.param('fullName') + "'s details has been removed from the system.";
 
                EmployeeActivitiesService.saveEmployeeActivity({ type : 1.2, empId : id, description : description, title : title }, function( response ){

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

