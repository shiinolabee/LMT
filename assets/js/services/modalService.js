
// cereliApp 
//     .service('modalService', [ '$uibModal', function( $uibModal ){

//         var modalDefaults = {
//             backdrop : true,
//             keyboard : true,
//             modalFade : true,
//             templateUrl : '/templates/common/modal.html'
//         };

//         var modalOptions = {
//             closeButtonText : 'Close',
//             actionButtonText : 'OK',            
//         };

//         this.showModal = function( customModalDefaults, customModalOptions ) {

//             if ( customModalDefaults ) customModalDefaults = {};

//             customModalDefaults.backdrop = 'static';

//             return this.show(customModaulDefaults, customModalOptions);
//         };

//         this.show = function( customModalDefaults, customModalOptions) {

//             //Create temporary objects to work with singleton pattern service
//             var tempModalDefaults = {},
//                 tempModalOptions = {};

//             //Map modal.html $scope custom properties to defaults defined in service
//             angular.extend(tempModalOptions, modalOptions, customModalOptions);

//             if( !tempModalDefaults.controller ) {
//                 tempModalDefaults.controller = function( $scope, $uibModalInstance ) {
//                     $scope.modalOptions = tempModalOptions;

//                     $scope.modalOptions.ok = function( result ) {
//                         $uibModalInstance.close(result);
//                     }

//                     $scope.modalOptions.close = function( result ) {
//                         $uibModalInstance.dismiss('cancel');
//                     }
//                 }
//             }

//             return $uibModal.open(tempModalDefaults).result;

//         };

//     }])