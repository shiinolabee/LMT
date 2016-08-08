
cereliApp.service('employeeService', [ '$http', '$q' , function( $http, $q ){
        
    return {

        getEmployee : function( id ) {

            var defer = $q.defer();

            $http.get('employees/getEmployee/' + id)
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

        saveEmployee: function( employeeDetails, id) {

            var defer = $q.defer();

            var postVars = {
                employee : employeeDetails
            };

            if ( id ) {
                postVars.id = id;
            }   
            
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