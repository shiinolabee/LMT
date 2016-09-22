/**
 * DepartmentsController
 *
 * @description :: Server-side logic for managing departments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	getDepartment : function( req, res ){

        var criteria = (req.param('criteria')) ? req.param('criteria') : undefined;       

        DepartmentService.getDepartment(criteria, function( department ){
            res.json(department);
        });	    
	},

    sortBy : function( req, res ){

        var data = req.param('data');

        DepartmentService.getSortingList(data, function( response ){
            if ( response ) {
                res.json({ success :true, data : response });
            }
        });

    },

	getDepartmentList : function( req, res ){  

        DepartmentService.getDepartmentList(function( departments ){
            if ( departments ) {
                res.json({ success : true, data : departments});                
            }
        });
    },

	saveDepartment : function( req, res ){

	 	if ( req.param('id') ) {

            DepartmentService.updateDepartment(req.param('activeRecord'), req.param('id'), function( response ) {
                if ( response ) {
                    var responseData = response;
                    var id = req.param('userId');
                    var title =  "Department Record";
                    var description = "\"" + req.param('activeRecord').departmentName + "\" department has been updated/changed.";

                    EmployeeActivitiesService.saveEmployeeActivity({ type: 4, empId : id, description : description, title : title }, function( response ){

                        if ( response ) {
                            return res.json( { success : true , data : responseData  });    
                        }
                    });                 
                } else {
                    res.json(response.status, { success : false , data : "Error"  });                
                }   
            }); 
        } else {           
            DepartmentService.saveDepartment(req.param('activeRecord'), function(response) {
                if ( response ) {
                    var responseData = response;
                    var id = req.param('userId');
                    var title =  "New Department";                    
                    var description = "\"" + req.param('activeRecord').departmentName + "\" department has been registered.";

                    EmployeeActivitiesService.saveEmployeeActivity({ type: 4, empId : id, description : description, title : title }, function( response ){

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

	removeDepartment: function(req, res) {        
        
        var departmentId = ( req.param('id') )  ? req.param('id') : undefined;

        DepartmentService.removeDepartment(departmentId, function(response) {
            if ( response ) {
                var responseData = response;
                var id = req.param('userId');
                var title =  "Remove Department";                    
                var description = "Department \"" + req.param('departmentName') + "\" has been removed.";

                EmployeeActivitiesService.saveEmployeeActivity({ type: 2.2, empId : id, description : description, title : title }, function( response ){

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

