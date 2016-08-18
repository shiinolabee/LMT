(function(){

	var cereliDirectives = angular.module('cereliDirectives', []);


	cereliDirectives.controller('DashboardController' , [ '$scope' ,function( $scope ){

	}])

	cereliDirectives.filter('contentIsEmpty', function(){
		
		return function( value ) {
			if ( !value ) {
				return 'Not yet specified.'
			}
			return value;
		}
	})

	cereliDirectives.directive('showSubdetailsEmployee', function(){

		return {		

			scope : { id : '@', type : '@', index : '@' },			

			link : function( scope, element, attr ) {				

				if ( scope.id > 0 ) {

					angular.forEach(scope.$parent.departmentList, function(value, key){

						if ( value.id == scope.id ) {						
							scope.selectedDepartment = value.departmentName;														
						}
					});

				} else {
					scope.selectedDepartment = "Not yet specified"					
				}				
			}, 		

			template : '{{ selectedDepartment }}',
		};

	})


	cereliDirectives.directive('tabs', function(){

		return {

			restrict : 'E',

			transclude : true,

			scope : {},

			controller : function( $scope , $element ){

				var panes = $scope.panes = [];

				$scope.select = function( pane ) {

					angular.forEach(panes, function(pane){

						pane.selected = false;

					});

					pane.selected = true;
				};

				this.isSet = function( checkTab ) {};

				this.addPane = function( pane ) {
					if ( pane.length !== 0 ) $scope.select(pane);

					panes.push(pane);
				};
			},

			templateUrl : './templates/common/tabs.html',

			replace : true
		};

	});

	cereliDirectives.directive('pane', function(){

		return {

			require : '^tabs',

			restrict : 'E',

			transclude : true,

			scope : { title : '@' },

			link : function ( scope, element, attrs, tabsController ) {

				tabsController.addPane(scope);
			},

			controller : function( $scope, $element ){

				var forms = $scope.forms = [];

				this.addForm = function(form){

					forms.push(form);

				};
			},

			templateUrl : './templates/common/pane.html',

			replace : true
		};

	});

	cereliDirectives.directive('searchForm', function(){

		return {

			require : 'ngModel',

			restrict : 'E',

			controller : function( $scope ) {
				
			}

		}

	});

	cereliDirectives.directive('msgform', function(){


			return {

				require : '^pane',

				restrict : 'E',

				transclude : true,

				scope : { title : '@' } ,

				link : function ( scope, element, attrs, paneController) {
					paneController.addForm(scope);
				},

				controller : function( $scope, $element ) {

					/*socket.on('init', function( data ) {
						$scope.name = data.name;
						$scope.users = data.users;
					});

					socket.on('send:message', function( message ) {
						$scope.messages.push(message);
					});

					socket.on('change:name', function( data ) {
						// change name
					});

					socket.on('user:join', function( data ) {
						$scope.messages.push({
							user : $scope.title,
							message : 'Teammate ' + data.name + ' has joined.'
						});

						$scope.users.push(data.name);
					});

					socket.on('user:left', function( data ){

						$scope.messages.push({
							user : $scope.title,
							message : 'User ' + data.name + ' has left.'
						});

						var i,user;

						for ( i = 0; i < $scope.users.length; i++) {
							user = $scope.users[i];

							if ( user === data.name ) {
								$scope.users.splice(i,1);
								break;
							}
						}

					});*/

					$scope.messages = [];
					$scope.message = '';

					$scope.send = function(){

						// socket.emit('send:message', {
						// 	message : $scope.message
						// });

						if ( $scope.message ) {
							$scope.messages.push({
								user : $scope.name,
								text : $scope.message
							});
						}

						$scope.message = '';
					};
				},

				templateUrl : './templates/common/form.html',

				replace : true
			};
	});

})();
