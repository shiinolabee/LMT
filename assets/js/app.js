'use strict';


var cereliApp = angular.module('cereliApp', [ 'ui.bootstrap', 'ngAnimate', 'ui.router', 'cereliDirectives' ]);


cereliApp.config([ '$stateProvider', '$locationProvider', '$urlRouterProvider', 'AccessLevels' , function( $stateProvider, $locationProvider, 
        $urlRouterProvider, AccessLevels ){

    $urlRouterProvider            
        .otherwise("/dashboard");

    $stateProvider
        .state('login.modal', {
            url : '',
            views : {             
                'extra-content' : {
                    templateUrl : 'templates/common/modal.html',                    
                    resolve : {

                    },
                    controller : function( modalService ){
                    },
                    controllerAs : 'loginModal',                                     
                }
            }
        })

        .state('login', {
            url : '/login',
            views : {
                'parent-content' : {
                    templateUrl : 'templates/auth/login.html',
                    controller : 'LoginController'
                }      
            }
        })
        .state('admin', {
            abstract:true,      
            url : '/',      
            views :{
                'parent-content' : {
                    templateUrl : 'templates/common/layout.html',
                    controller : 'adminController'
                }                  
            },
            data: {
              access: AccessLevels.user
            },
        })

        .state('admin.dashboard', {
            url : 'dashboard',
            views : {
                'child-content' : {
                    templateUrl : 'templates/admin/dashboard.html',
                    controller : 'DashboardController',
                    controllerAs : 'dashboard'
                }
            },
            data: {
                access: AccessLevels.user,
                menuCode : 1,
                isChild : false
            },
        })

        .state('admin.employees', {               
            url : 'employees/time_records',
            views : {
                'child-content' : {
                    templateUrl : 'templates/employees/list.html',                    
                    controller : 'employeeController',
                    controllerAs : 'employeeCtrl'
                }
            },
            data : {
                menuCode : 2,
                isChild : false
            }
        })  

        .state('admin.settings', {               
            url : 'time_records/settings',
            views : {
                'child-content' : {
                    templateUrl : 'templates/employees/settings.html',                  
                }
            },
            data : {
                menuCode : 2.5,
                isChild : false
            }
        })  

        .state('admin.reports' ,{
            url : 'reports',
            views : {
                'child-content' : {
                    templateUrl : 'templates/reports/index.html'
                }
            },
            data : {
                menuCode : 3,
                isChild : false
            }
        })  

        .state('admin.accounting' ,{
            url : 'accounting',
            views : {
                'child-content' : {
                    templateUrl : 'templates/accounting/index.html'
                }
            },
            data : {
                menuCode : 4,
                isChild : false
            }
        }) 

        .state('admin.reports.new-todo' ,{
            url : '/new-todo',
            views : {
                'child-content' : {
                    templateUrl : 'templates/reports/todo.html'
                }
            }
        })

        .state('user', {            
            abstract: true,
            template: '<ui-view/>',
            data: {
              access: AccessLevels.user
            }
        })

        .state('user.messages', {
            url: '/messages',
            templateUrl: 'templates/user/messages.html',
            controller: 'MessagesController'
        })
    ;

    $locationProvider.html5Mode(true);

}]);

cereliApp
    .run(function($rootScope, $state, Auth) {

        $rootScope.$state = $state;  

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {                                    

            // if( toState.url != '/login' ) {

            //     if ( !Auth.authorize(toState.data.access)) {
            //         event.preventDefault();

            //         $state.go('login');
            //     }
              
            // }                               
            $rootScope.selectedMenu = toState.data.menuCode;


            $rootScope.isAuthenticated = true;
            $rootScope.currentState = toState.name.split('.')[1];                 

        });
    });


// cereliApp.run([ '$rootScope', '$state', '$location', 'authService' ,function( $rootScope, $state, $location, authService ){

//     $rootScope.$state = $state;    

//     $rootScope.$on('$stateChangeStart', function( e, toState, toParams, fromState, fromParams ){

//         $rootScope.currentState = toState.name.split('.')[1];     

//         $rootScope.isAuthenticated = false;

//         if(toState.url != '/login' && toState.url != '/logout') {

//             authService.getAuthenticatedUser().then(function(response) {

//                 // Stringify the returned data to prepare it
//                 // to go into local storage
//                 var user = JSON.stringify(response.data.user);

//                 // Set the stringified user data into local storage
//                 localStorage.setItem('user', user);

//                 // The user's authenticated state gets flipped to
//                 // true so we can now show parts of the UI that rely
//                 // on the user being logged in
//                 $rootScope.isAuthenticated = true;

//                 // Putting the user's data on $rootScope allows
//                 // us to access it anywhere across the app
//                 $rootScope.currentUser = response.data.user;
//             });

//         }       

//     }) 

// }]);

// cereliApp.controller('authCtrl', ['$scope', 'authService', '$state', '$rootScope', function($scope, authService, $state, $rootScope) {

//     $scope.user = {
//         username: '',
//         password: ''
//     };

//     if($rootScope.isAuthenticated)
//         $state.go('admin.dashboard');


//     $scope.login = function() {
//         var loginResponse = authService.login($scope.user).then(function(response) {
//             return authService.getAuthenticatedUser();
//         });

//         loginResponse.then(function(response) {

//             // Stringify the returned data to prepare it
//             // to go into local storage
//             var user = JSON.stringify(response.data.user);

//             // Set the stringified user data into local storage
//             localStorage.setItem('user', user);

//             // The user's authenticated state gets flipped to
//             // true so we can now show parts of the UI that rely
//             // on the user being logged in
//             $rootScope.isAuthenticated = true;

//             // Putting the user's data on $rootScope allows
//             // us to access it anywhere across the app
//             $rootScope.currentUser = response.data.user;

//             // Everything worked out so we can now redirect to
//             // the users state to view the data
//             $state.go('admin.dashboard');
//         });
//     }

// }]);