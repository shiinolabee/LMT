(function(){

    'use strict';

    var activeRecordFactory = function( $http, $q ){

        return {

            getActiveRecord : function( criteria, url ) {

                var defer = $q.defer();

                $http.post(url, criteria )
                    .success(function( response ){
                        defer.resolve(response);
                    })
                    .error(function( error ){
                        defer.reject(error);
                    })
                ;

                return defer.promise;
            },

            getActiveRecordList : function( url ) {

                var defer = $q.defer();

                $http.get(url)
                    .success(function( response ){
                        defer.resolve(response);
                    })
                    .error(function( error ){
                        defer.reject(error);
                    })
                ;

                return defer.promise;
            },

            saveActiveRecord: function( activeRecordDetails, isEditMode, url) {

                var defer = $q.defer();

                var postVars = {};

                postVars.id = isEditMode ? activeRecordDetails.id : 0;

                // edit mode remove id from update object
                if ( isEditMode ) {
                    delete activeRecordDetails.id;  
                    delete activeRecordDetails.createdAt;
                    delete activeRecordDetails.updatedAt;
                } 

                postVars.activeRecord = activeRecordDetails;
                
                $http.post(url, postVars)
                    .success(function(resp){
                        defer.resolve(resp);
                    })
                    .error( function(err) {
                        defer.reject(err);
                    })
                ;
                
                return defer.promise;
            }, 

            updateActiveRecord: function( data, url ) {

                var defer = $q.defer();
                
                $http.post(url, data)
                    .success(function(resp){
                        defer.resolve(resp);
                    })
                    .error( function(err) {
                        defer.reject(err);
                    })
                ;
                
                return defer.promise;
            },

            removeActiveRecord : function( activeRecord, url ) {

                var defer = $q.defer();
                
                $http.post(url, activeRecord)
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

    };

    angular.module('cereliApp').factory('ActiveRecordFactory', activeRecordFactory);

    activeRecordFactory.$inject = [ '$http', '$q' ];

})();