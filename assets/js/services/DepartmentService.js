cereliApp
	.service('departmentService', [ '$http', '$q' , function( $http, $q ){

		return {

			getDepartment : function(){

			},

			saveDepartment : function( department, isEditMode ){

				var defer = $q.defer();

	            var postVars = {};

	            postVars.id = isEditMode ? department.id : 0;

	            // edit mode remove id from update object
	            if ( isEditMode ) {
	                delete department.id;  
	                delete department.createdAt;
	                delete department.updatedAt;
	            } 

	            postVars.department = department;
	            
	            $http.post('departments/saveDepartment', postVars)
	                .success(function(resp){
	                    defer.resolve(resp);
	                })
	                .error( function(err) {
	                    defer.reject(err);
	                })
	            ;
	            
	            return defer.promise;
			}

		}

	}])