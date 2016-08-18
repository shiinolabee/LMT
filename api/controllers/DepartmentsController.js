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

	getDepartmentList : function( req, res ){  

        DepartmentService.getDepartmentList(function( departments ){
            if ( departments ) {
                res.json({ success : true, data : departments});                
            }
        });
    },

	saveDepartment : function( req, res ){

	 	if ( req.param('id') ) {

            DepartmentService.updateDepartment(req.param('activeRecord'), req.param('id'), function(success) {
                if ( success ) {
                    res.json( { success : true , data : success  });                
                }
            }, function( xhr, errMsg ){
                res.json( { success : false , data : success  });                            
            }); 
        } else {           
            DepartmentService.saveDepartment(req.param('activeRecord'), function(success) {
                if ( success ) {
                    res.json( { success : true , data : success  });                
                }
            }, function( xhr, errMsg ){
                res.json( { success : false , data : success  });                            
            });
        }

	},

	removeDepartment: function(req, res) {        
        
        var departmentId = ( req.param('id') )  ? req.param('id') : undefined;

        DepartmentService.removeDepartment(departmentId, function(success) {
            res.json( { success : true , data : success.id  });
        });
    }
	
};

