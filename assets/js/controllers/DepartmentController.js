cereliApp
	.controller('departmentController', [ '$scope', '$uibModal', 'pagerService', 'activeRecordService', function( $scope, $uibModal, pagerService, activeRecordService ){

        var _self = this;        

		$scope.mainDataList = [];
        $scope.mainDataListAlerts = [];

		_self.dummyMainDataList = [];
		_self.pager = {};

		_self.recordStatusArr = [ 
            {  name : 'Active', value : 1 },
            {  name : 'Inactive', value : 0}
        ];

		$scope.addAlert = function(type, options) {
            $scope[type].push(options);
        };

        $scope.closeAlert = function(type, index) {
            $scope[type].splice(index, 1);
        };

        _self.setPage = function( page ){

        	if ( page < 1 || page > _self.pager.totalPages ) {
        		return;
        	}

        	_self.pager = pagerService.getPager(_self.dummyMainDataList.length, page);

        	$scope.mainDataList = _self.dummyMainDataList.slice(_self.pager.startIndex, _self.pager.endIndex + 1);
        };

        _self.tableHeaders = [
            { name : 'departmentCode', label : 'Department Code' },
            { name : 'departmentName', label : 'Department Name' },
            { name : 'locationId', label : 'Location ID' },           
            { name : 'updatedAt', label : 'Date Updated' }           
        ];

        _self.initDepartmentValues = function( isEditMode, index ){

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
        		var department = angular.copy($scope.mainDataList[index]);
        	}

        	return department;
        }

        _self.getDepartmentList = function(){

    	   activeRecordService.getActiveRecordList('departments/getDepartmentList').then(function( response ){

                if ( response.success ) {
                    $scope.mainDataList = response.data;                    
                    _self.dummyMainDataList = response.data;                    
                    _self.setPage(1);
                }
            });

        }

        _self.saveDepartmentRecord = function( index, isEditMode ){

        	$scope.editMode = isEditMode;
        	$scope.index = index;

        	var modalInstance = $uibModal.open({
        		animation : true,
        		keyboard : false,
                backdrop : false,
        		resolve : {
        			departmentInitialValues : function(){
        				return _self.initDepartmentValues($scope.editMode, $scope.index);
        			},
        			isEditMode : function(){
        				return $scope.editMode;
        			},
        			getRecordStatusArr : function(){
                        return _self.recordStatusArr;
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
        			_self.getDepartmentList();

        			$scope.addAlert('mainDataListAlerts', {
        				type : 'success',
        				msg : 'Department details successfully ' + ( isEditMode ? 'updated.' : 'added.') 
        			});
        		}
        	});

        };
   
        /**
        * Removes/Deletes department by id        
        **/
        _self.removeDepartment = function( id, index ) {

            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: false,
                backdrop: 'static',                    
                templateUrl: 'templates/common/modal.html',          
                windowTemplateUrl : 'templates/common/ui-modal.html',
                resolve: {                       
                    departmentDetails: function() {
                        return $scope.mainDataList[index];
                    },
                    index: function() {
                        return index;
                    }
                },
                size: 'sm',
                controller: function($scope, $uibModalInstance, departmentDetails, index, activeRecordService) {                       

                    $scope.modalOptions = {
                        closeButtonText: 'Cancel',
                        headerText: 'Delete ' + (departmentDetails.departmentName) + '?',
                        actionButtonText: 'Delete Department details',
                        bodyText: 'Are you sure you want to delete department ' + (departmentDetails.departmentName)  + '\'s details?'
                    };

                    $scope.modalOptions.ok = function (result) {

                        var responseData;

                        activeRecordService.removeActiveRecord({ id : departmentDetails.id , departmentName : departmentDetails.departmentName }, 'departments/removeDepartment').then(function(response) {

                            if ( response.success ) {
                                responseData = response;                                    
                            }
                        }, function() {
                            responseData = {
                                success: false,
                                errors: ['Unknown error occured while deleting client note']
                            };

                        }).finally(function(){
                            modalInstance.close(responseData);                                
                        });                      
                    };

                    $scope.modalOptions.close = function (result) {
                        // $uibModalInstance.dismiss('cancel');
                        $uibModalInstance.dismiss('cancel');
                    };

                }
            });

            modalInstance.result.then(function(responseData) {

                if ( responseData.success ) {

                    $scope.mainDataList.splice(index, 1);
                    _self.getDepartmentList();

                    $scope.addAlert('mainDataListAlerts', {
                        type: 'success',
                        msg: 'Department Details Successfully Deleted'
                    });                    
                    
                }

            });
        };


        _self.getDepartmentList();

	}])