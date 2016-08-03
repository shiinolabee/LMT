
cereliApp
    .service('dataRecordService', [ '$http', '$q' , function( $http, $q ){
        
    return {

        get : function( modelType ) {

            var defer = $q.defer();           

            $http.get('/' + modelType + '/get' + modelType.toUpperCase())
                .success(function( response ){
                    defer.resolve(response);
                })
                .error(function( error ){
                    defer.reject(error);
                })
            ;

            return defer.promise;
        },

        add: function(modelType, dataObject) {

            var defer = $q.defer();
            
            $http.post('/' + modelType + '/add' + modelType.toUpperCase(), dataObject)
                .success(function(resp){
                    defer.resolve(resp);
                })
                .error( function(err) {
                    defer.reject(err);
                })
            ;
            
            return defer.promise;
        },

        remove : function( modelType, dataObject ) {

            var defer = $q.defer();
            
            $http.post('/' + modelType + '/remove', dataObject)
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

}])