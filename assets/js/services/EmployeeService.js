
cereliApp.service('employeeService', [ '$http', '$q' , function( $http, $q ){
        
    return {

        getEmployee : function() {

            var defer = $q.defer();

            $http.get('/employee/getEmployees')
                .success(function( response ){
                    defer.resolve(response);
                })
                .error(function( error ){
                    defer.reject(error);
                })
            ;

            return defer.promise;
        },

        addEmployee: function(employee) {

            var defer = $q.defer();
            
            $http.post('/employee/addEmployee', employee)
                .success(function(resp){
                    defer.resolve(resp);
                })
                .error( function(err) {
                    defer.reject(err);
                })
            ;
            
            return defer.promise;
        },

        remove : function( employee ) {

            var defer = $q.defer();
            
            $http.post('/employee/remove', employee)
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