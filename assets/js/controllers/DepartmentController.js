cereliApp
	.controller('departmentController', [ '$scope', '$uibModal', 'pagerService', 'activeRecordService', function( $scope, $uibModal, pagerService, activeRecordService ){

		$scope.departmentList = [];
        $scope.departmentListAlerts = [];

		$scope.dummyDepartmentList = [];
		$scope.pager = {};

		$scope.recordStatusArr = [ 
            {  name : 'Active', value : 1 },
            {  name : 'Inactive', value : 0}
        ];

		$scope.addAlert = function(type, options) {
            $scope[type].push(options);
        };

        $scope.closeAlert = function(type, index) {
            $scope[type].splice(index, 1);
        };

        $scope.setPage = function( page ){

        	if ( page < 1 || page > $scope.pager.totalPages ) {
        		return;
        	}

        	$scope.pager = pagerService.getPager($scope.dummyDepartmentList.length, page);

        	$scope.departmentList = $scope.dummyDepartmentList.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
        };

        $scope.initDepartmentValues = function( isEditMode, index ){

        	if ( !isEditMode && index == 0 ) {
        		var department = {
        			id : 0,
        			departmentName : '',
        			departmentCode : '0000',
        			locationId : '',
        			createdAt : '',
        			updatedAt : '',
        			recordStatus : 1        				
        		}
        	} else {
        		var department = angular.copy($scope.departmentList[index]);
        	}

        	return department;
        }

        $scope.getDepartmentList = function(){

    	   activeRecordService.getActiveRecordList('departments/getDepartmentList').then(function( response ){

                if ( response.success ) {
                    $scope.departmentList = response.data;                    
                    $scope.dummyDepartmentList = response.data;                    
                    $scope.setPage(1);
                }
            });

        }

        $scope.saveDepartmentRecord = function( index, isEditMode ){

        	$scope.editMode = isEditMode;
        	$scope.index = index;

        	var modalInstance = $uibModal.open({
        		animation : true,
        		keyboard : false,
        		resolve : {
        			departmentInitialValues : function(){
        				return $scope.initDepartmentValues($scope.editMode, $scope.index);
        			},
        			isEditMode : function(){
        				return $scope.editMode;
        			},
        			getRecordStatusArr : function(){
                        return $scope.recordStatusArr;
                    }
        		},
        		templateUrl : 'templates/departments/form.html',
        		// windowTemplateUrl : 'templates/common/ui-modal.html',
        		size : 'md',
        		controller : function( $scope, departmentInitialValues, isEditMode, getRecordStatusArr ) {

        			$scope.department = departmentInitialValues;
        			$scope.editMode = isEditMode;
        			$scope.recordStatusArr = getRecordStatusArr;

        			$scope.modalOptions = {
        				headerText : !$scope.editMode ? 'New Department' : 'Edit Department Details',
        				closeButtonText : 'Cancel',
        				actionButtonText : !$scope.editMode ? 'Save' : 'Save changes',

        				ok : function( result ){

        					var responseData;

        					activeRecordService.saveActiveRecord($scope.department, $scope.editMode, 'departments/saveDepartment').then(function( response ){
        						if ( response.success ){
        							responseData = response;
        						}
        					}, function( xhr, errMsg ){
        						responseData = {
        							success : false,
        							errors : errMsg
        						};
        					}).finally(function(){
        						modalInstance.close(responseData);
        					});

        				},

        				close : function(){
        					modalInstance.dismiss('cancel');
        				}
        			}

        		}
        	});

        	modalInstance.result.then(function( responseData ){

        		if ( responseData.success ) {
        			$scope.getDepartmentList();

        			$scope.addAlert('departmentListAlerts', {
        				type : 'success',
        				msg : 'Department details successfully ' + ( isEditMode ? 'updated.' : 'added.') 
        			});
        		}
        	});

        };

        $scope.getEmployeeList = function( department ){
        	
        	activeRecordService.getActiveRecordList('employees/getEmployeeList').then(function( response ){

                if ( response.success ) {
                    $scope.employeeList = response.data;                    
                    $scope.dummyEmployeeList = response.data;                    
                    $scope.setPage(1);
                }
            });
        }

        $scope.getDepartmentList();

	}])