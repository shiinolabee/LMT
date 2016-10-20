(function(){

	'use strict';

	var miniModalService = function( $uibModal ){

		return {
			createModal : function( options, modalOptions ){

				var defaultOptions = {					
					animation: true,
	                keyboard: false,
	                backdrop: false,                    
	                templateUrl: 'templates/common/modal.html',          
	                windowTemplateUrl : 'templates/common/ui-modal.html',	               
	                size: 'sm'
				};

				if ( options ) {					
			 		return $uibModal.open(options);
				} else {
			 		return $uibModal.open(defaultOptions);
				}
			 	
			}
		};

	};

	angular.module('cereliApp').service('miniModalService', miniModalService);

	miniModalService.$inject = [ '$uibModal' ];

})();