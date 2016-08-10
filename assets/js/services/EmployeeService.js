
cereliApp.service('employeeService', [ '$http', '$q' , function( $http, $q ){
        
    return {

        getEmployee : function( criteria ) {

            var defer = $q.defer();

            $http.get('employees/getEmployee/' + criteria)
                .success(function( response ){
                    defer.resolve(response);
                })
                .error(function( error ){
                    defer.reject(error);
                })
            ;

            return defer.promise;
        },

        getListEmployees : function() {

            var defer = $q.defer();

            $http.get('/employees/getEmployeeList')
                .success(function( response ){
                    defer.resolve(response);
                })
                .error(function( error ){
                    defer.reject(error);
                })
            ;

            return defer.promise;
        },

        saveEmployee: function( employeeDetails, isEditMode) {

            var defer = $q.defer();

            var postVars = {};

            postVars.id = isEditMode ? employeeDetails.id : 0;

            // edit mode remove id from update object
            if ( isEditMode ) {
                delete employeeDetails.id;  
                delete employeeDetails.createdAt;
                delete employeeDetails.updatedAt;
            } 

            postVars.employee = employeeDetails;
            
            $http.post('employees/saveEmployee', postVars)
                .success(function(resp){
                    defer.resolve(resp);
                })
                .error( function(err) {
                    defer.reject(err);
                })
            ;
            
            return defer.promise;
        }, 

        editEmployee: function( employeeDetails ) {

            var defer = $q.defer();
            
            $http.post('employees/editEmployee', { employee : employeeDetails })
                .success(function(resp){
                    defer.resolve(resp);
                })
                .error( function(err) {
                    defer.reject(err);
                })
            ;
            
            return defer.promise;
        },

        removeEmployee : function( employee ) {

            var defer = $q.defer();
            
            $http.post('employees/removeEmployee', { id : employee })
                .success(function(resp){
                    defer.resolve(resp);
                })
                .error( function(err) {
                    defer.reject(err);
                })
            ;

            return defer.promise;
        }

    };

}]);