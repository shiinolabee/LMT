(function(){
	'use strict';
	
	var reportsController = function( $scope, ActiveRecordFactory, departmentList ){

		var _self = this;

		_self.alerts = [];

		_self.departmentList = departmentList.data;

		$scope.getDepartmentList = function(){
			return _self.departmentList;
		};

        $scope.addAlert = function(type, options) {
            _self[type].push(options);
        };        

        $scope.closeAlert = function(type, index) {
            _self[type].splice(index, 1);
        };

		

	};

	angular.module('cereliApp').controller('reportsController', reportsController);

	reportsController.$inject = [ '$scope', 'ActiveRecordFactory', 'departmentList' ];

})();