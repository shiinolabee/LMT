/**
 * EmployeesController
 *
 * @description :: Server-side logic for managing employees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
                    dateAttended : '',
                    time : ''
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

                // console.log(tempArray);

                if ( tempArray.length ) {                    
                    tempTimeRecord.empId = parseInt(tempArray[0]);
                    tempTimeRecord.dateAttended = tempArray[1].replace(new RegExp('/', 'g'),'-');
                    tempTimeRecord.time = tempArray[2].length <=5 ? tempArray[2] + ':00' : tempArray[2];                                    
    
                    console.log(tempTimeRecord);

                    EmployeesTimeRecordService.saveEmployeeTimeRecord(tempTimeRecord, function( response ){
                        // res.json(repsonse);                  
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
                files : uploadedFiles
            });

        });

    },

    getEmployeeTimeRecord : function( req, res ){

        EmployeesTimeRecordService.getEmployeeTimeRecord(req.param('id'),function( employeeTimeRecords ){
            if ( employeeTimeRecords ) {
                res.json({ success : true, data : employeeTimeRecords});                
            }
        });
    },

    getEmployeeAttributes : function( req, res ) {

        return Employees.getAllAttributes();       

    },

    getEmployee : function( req, res ){  
        
        var criteria = (req.param('criteria')) ? req.param('criteria') : undefined;       

        EmployeesService.getEmployee(criteria, function( employee ){
            res.json(employee);
        });
    },

    getEmployeeList : function( req, res ){         

        EmployeesService.getEmployeeList(function( employees ){
            if ( employees ) {
                res.json({ success : true, data : employees});                
            }
        });
    },

    saveEmployee: function(req, res) {     

        if ( req.param('id') ) {

            EmployeesService.editEmployee(req.param('activeRecord'), req.param('id'), function(success) {
                if ( success ) {
                    res.json( { success : true , data : success  });                
                }
            }, function( xhr, errMsg ){
                res.json( { success : false , data : success  });                            
            }); 
        } else {           
            EmployeesService.saveEmployee(req.param('activeRecord'), function(success) {
                if ( success ) {
                    res.json( { success : true , data : success  });                
                }
            }, function( xhr, errMsg ){
                res.json( { success : false , data : success  });                            
            });
        }

    },

    removeEmployee: function(req, res) {        
        
        var employeeVal = ( req.param('id') )  ? req.param('id') : undefined;

        EmployeesService.removeEmployee(employeeVal, function(success) {
            res.json( { success : true , data : success.id  });
        });
    }
	
};

