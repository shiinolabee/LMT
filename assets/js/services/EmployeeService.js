
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

        saveEmployee: function(employee) {

            var defer = $q.defer();
            
            $http.post('employees/saveEmployee', employee)
                .success(function(resp){
                    defer.resolve(resp);
                })
                .error( function(err) {
                    defer.reject(err);
                })
            ;
            
            return defer.promise;
        }, 

        editEmployee: function(employee) {

            var defer = $q.defer();
            
            $http.post('employees/editEmployee', employee)
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
            
            $http.post('employees/removeEmployee', { empId : employee })
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