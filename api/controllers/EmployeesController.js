/**
 * EmployeesController
 *
 * @description :: Server-side logic for managing employees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    uploadTimeRecord : function( req, res ){

        var responseDataList = [];

        req.file('file').upload({            
            maxBytes: 10000000, // don't allow the total upload size to exceed ~10MB
            dirname: require('path').resolve(sails.config.appPath, 'assets/uploads'),
            adapter: require('skipper-csv'),
            csvOptions: {delimiter: ',', columns: true},
            rowHandler: function(row, fd){    

                var tempTimeRecord = {                    
                    empId : 0,                                        
                    dateAttended : '',
                    time : '',
                    remarks : '',
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

                console.log(tempArray);

                if ( tempArray.length > 0) { 
                    tempTimeRecord.empId = parseInt(tempArray[0]);
                    tempTimeRecord.dateAttended = tempArray.length >= 2 ? tempArray[1].replace(new RegExp('/', 'g'),'-') : new Date().now();
                    tempTimeRecord.time = tempArray.length >= 3 ? tempArray[2] + ':00' : '00:00:00';                                    
    
                    console.log(tempTimeRecord);

                    EmployeesTimeRecordService.saveEmployeeTimeRecord(tempTimeRecord, function( response ){

                        var isSuccess = !response.status ? true : false;
                        var responseData = { success : isSuccess , data : response  };                                          

                        responseDataList.push(responseData);                 
                    })
                }
                

            },

        }, function whenDone( err, uploadedFiles ){

            if ( err ) {
                return res.negotiate(err);   
            }

            return res.json({
                success : true,
                message : 'Uploaded ' + uploadedFiles.length + ' CSV files!',
                files : uploadedFiles,
                data : responseDataList
            });

        });

    },

    getEmployeeStatisticsReport : function( req, res ){

        if ( req.param('id') ) {

            EmployeesTimeRecordService.getEmployeeTimeRecord(req.param('id'),function( response ){

               var isSuccess = !response.status ? true : false;
               
               res.json( { success : isSuccess , data : response  });                    
                
            });

        }

    },

    getEmployeeTimeRecord : function( req, res ){

        EmployeesTimeRecordService.getEmployeeTimeRecord(req.param('id'),function( response ){

            var isSuccess = !response.status ? true : false;
           
            res.json( { success : isSuccess , data : response  });      
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

    getEmployeeList : function( req, res ){         

        EmployeesService.getEmployeeList(function( response ){

            var isSuccess = !response.status ? true : false;
           
            res.json( { success : isSuccess , data : response  });      
        });
    },

    saveEmployee: function(req, res) {     

        if ( req.param('id') ) {

            EmployeesService.editEmployee(req.param('activeRecord'), req.param('id'), function(response) {                

                var isSuccess = !response.status ? true : false;
               
                res.json( { success : isSuccess , data : response  });      
            }); 
        } else {           
            EmployeesService.saveEmployee(req.param('activeRecord'), function(response) {

                var isSuccess = !response.status ? true : false;
               
                res.json( { success : isSuccess , data : response  });      
            });
        }

    },

    removeEmployee: function(req, res) {        
        
        var employeeVal = ( req.param('id') )  ? req.param('id') : undefined;

        EmployeesService.removeEmployee(employeeVal, function(response) {

            var isSuccess = !response.status ? true : false;               
            res.json( { success : isSuccess , data : response  });      
        });
    }
	
};

