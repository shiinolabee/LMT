/**
 * EmployeesController
 *
 * @description :: Server-side logic for managing employees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');
var promise = require('q');
var employeeUploadedDataList = []; 

module.exports = {

    uploadCsvRecords : function( req, res ){

        req.file('file').upload({            
            maxBytes: 10000000, // don't allow the total upload size to exceed ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/uploads'),
            adapter: require('skipper-csv'),
            csvOptions: {delimiter: ',', columns: true},         
            rowHandler: function(row, fd){    
        
               var tempEmployeeRecord = {
                    id : 0,
                    empId : '',
                    position : '',
                    departmentAssigned : 0,
                    dateHired : moment().toDate(),
                    dateRegularized : moment().toDate(),
                    paidLeaveLimit : 0,
                    unpaidLeaveLimit : 0,
                    noOfAbsences : 0,
                    noOfLates: 0,
                    totalOvertime : 0,
                    recordStatus : 1,                                      
                    contactNumber : '',
                    gender : 0,
                    homeAddress : '',
                    emailAddress : '',
                    createdAt : '',
                    updatedAt : ''
                };

                var tempArray = [];                            

                Object.keys(row).forEach(function(key){
                    tempArray.push(row[key]);
                });                

                if ( tempArray.length > 0) {  

                    tempEmployeeRecord.empId = tempArray[0];
                    tempEmployeeRecord.fullName = tempArray[1];   

                    if ( tempArray.length >= 3 ) {
                        tempEmployeeRecord.position = tempArray[2];
                    }

                    console.log(tempEmployeeRecord);
                  
                    EmployeesService.saveEmployee(tempEmployeeRecord, function( response ){
                        employeeUploadedDataList.push(response);                 
                    });

                }
                

            },

        }, function whenDone( err, uploadedFiles ){

            if ( err ) {
                return res.negotiate(err);   
            }

            var id = req.param('userId');
            var title = "Employee Records";
            var description = "File " + uploadedFiles[0].filename + " has been successfully imported.";

            EmployeeActivitiesService.saveEmployeeActivity({ type : 0, userId : id, description : description, title : title }, function( response ){

                if ( response ) {

                    return res.json({
                        success : true,
                        message : 'Time record file ' + uploadedFiles[0].filename + ' successfully imported '+ employeeUploadedDataList.length +' records.',
                        files : uploadedFiles,
                        data : employeeUploadedDataList
                    });
                }
            });


        });

    },

    getTimeRecordList : function( req, res ){

        Employee_time_records.find().exec(function( err, time_records ) {

            if( err ) callback(err);

            sails.log('There are %d time_records time record(s) fetched in the collection.', time_records.length);

            res.json({ success : true, data : time_records});
            
        });
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
            
            if ( response ) {
                res.json( { success : true , data : response  });    
            } else {
                res.json(response.status, { success : false , data : "Error"  });                
            } 
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

    saveBulkEmployees : function( req, res ){

        if ( req.param('empIds') ) {
            var i, transactionResults = [];

            var empIds = req.param('empIds').split(',');

            for (var i=0; i < empIds.length; i++) (function(i){

                var empDataRecord = req.param('dataAttrs');

                empDataRecord.empId = empIds[i].trim();

                EmployeesService.saveEmployee( empDataRecord, function(response) {                

                    if ( response ) transactionResults.push(response);

                    return transactionResults;
                });                   

            })(i); // avoid the closure loop problem

            promise.all(transactionResults).then(function(response){

                var responseData = response || transactionResults;
                var id = req.param('userId');
                var title = "Created Employee Dummy List" ;
                var description = "Employee IDs\'s [ " + req.param('empIds') + " ] List has been registered.";

                EmployeeActivitiesService.saveEmployeeActivity({ type : 1.3, userId : id, description : description, title : title }, function( response ){

                    if ( response ) {
                        return res.json( { success : true , data : responseData  });    
                    }
                });

            });   
        }
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
        } else if ( req.param('ids') ) {  

            var i, queryResults = [];

            for (var i=0; i < req.param('ids').length; i++) (function(i){

                EmployeesService.editEmployee(req.param('data'), req.param('ids')[i], function(response) {                

                    if ( response ) queryResults.push(response);

                    return queryResults;
                });                   

            })(i); // avoid the closure loop problem

            promise.all(queryResults).then(function(response){

                var responseData = response || queryResults;
                var id = req.param('userId');
                var title = "Update Employee List Details" ;
                var description = "Employee ID\'s [ " + req.param('ids').join(',') + " ] Details has been updated.";

                EmployeeActivitiesService.saveEmployeeActivity({ type : 1.3, userId : id, description : description, title : title }, function( response ){

                    if ( response ) {
                        return res.json( { success : true , data : responseData  });    
                    }
                });

            });   

        } else {
            EmployeesService.saveEmployee(req.param('activeRecord'), function(response) {

                if ( response ) {
                    var responseData = response;
                    var id = response.id;
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

        if ( employeeVal ) {

            EmployeesService.removeEmployee(employeeVal, function(response) {

                if ( response ) {

                    Employee_time_records.destroy( { empId : response[0].empId } ).exec(function( err, time_records ){

                        if( err ) throw err;

                        sails.log('Time record details of Employee ID ' + response[0].empId +' successfully removed in the collection.'); 
                        
                        
                        var responseData = response;
                        var id = req.param('id');
                        var title = "Remove Employee";
                        var description = req.param('fullName') + "'s details has been removed from the system.";
         
                        EmployeeActivitiesService.saveEmployeeActivity({ type : 1.2, empId : id, description : description, title : title }, function( response ){

                            if ( response ) {
                                return res.json( { success : true , data : responseData  });    
                            }
                        });                 
                    });
                    
                } else {
                    res.json(response.status, { success : false , data : "Error"  });                
                }  
            });
        } else if ( req.param('ids') ) {

            var i, queryResults = [];

            for (var i=0; i < req.param('ids').length; i++) (function(i){

                EmployeesService.removeEmployee(req.param('ids')[i], function(response) {                

                    if ( response ) queryResults.push(response);

                    Employee_time_records.destroy( { empId : response[0].empId } ).exec(function( err, time_records ){

                        if( err ) throw err;

                        sails.log('Employee ID ' + response[0].empId +' successfully removed in the collection.'); 
                        
                        return queryResults;
                    });

                });                   

            })(i); // avoid the closure loop problem

            promise.all(queryResults).then(function(response){

                var responseData = response || queryResults;
                var id = req.param('userId');
                var title = "Remove Employee List Details" ;
                var description = "Employee ID\'s [ " + req.param('ids').join(',') + " ] Details has been removed from the system.";

                EmployeeActivitiesService.saveEmployeeActivity({ type : 1.4, userId : id, description : description, title : title }, function( response ){

                    if ( response ) {
                        return res.json( { success : true , data : responseData  });    
                    }
                });

            });   

        }

    }
	
};

