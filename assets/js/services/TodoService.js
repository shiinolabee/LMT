
cereliApp.service('todoService', [ '$http', '$q' , function( $http, $q ){
        
    return {

        getTodos : function() {

            var defer = $q.defer();

            $http.get('/todo/getTodos')
                .success(function( response ){
                    defer.resolve(response);
                })
                .error(function( error ){
                    defer.reject(error);
                })
            ;

            return defer.promise;
        },

        addTodo: function(todo) {

            var defer = $q.defer();
            
            $http.post('/todo/addTodo', todo)
                .success(function(resp){
                    defer.resolve(resp);
                })
                .error( function(err) {
                    defer.reject(err);
                })
            ;
            
            return defer.promise;
        },

        removeTodo : function( todo ) {

            var defer = $q.defer();
            
            $http.post('/todo/removeTodo', todo)
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