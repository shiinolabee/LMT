(function(){
	'use strict';

	var dashboardController = function( $scope, departmentList, employeeList ){

		var _self = this;

		_self.departmentList = departmentList.data;
		_self.employeeList = employeeList.data;

		$scope.getDepartmentList = function(){
			return _self.departmentList;
		};	

		$scope.getEmployeeList = function(){
			return _self.employeeList;
		};


	};

	angular.module('cereliApp').controller('dashboardController', dashboardController);

	dashboardController.$inject = [ '$scope', 'departmentList', 'employeeList' ];

})();