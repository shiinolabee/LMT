(function(){

    'use strict';

    var cereliApp = angular.module('cereliApp', [ 'angular.filter', 'pasvaz.bindonce', 'angularMoment', 'angucomplete-alt', 'cereliDirectives', 'mwl.calendar', 'ngAnimate','ui.bootstrap', 'ui.router' ]);

    cereliApp.config([ '$stateProvider', '$locationProvider', '$urlRouterProvider', 'AccessLevels' , function( $stateProvider, $locationProvider, 
            $urlRouterProvider, AccessLevels ){

        $urlRouterProvider            
            .otherwise("/dashboard");

        $stateProvider                    
            
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

            .state('admin.register', {
                url : 'register',
                views : {
                    'child-content' : {
                        templateUrl : 'templates/auth/register.html',
                        controller : 'registerController',
                        controllerAs : 'registerCtrl'
                    }
                },
                data: {
                  access: AccessLevels.anon
                }  
            })

            .state('admin.login', {
                url : 'login',
                views : {
                    'child-content' : {
                        templateUrl : 'templates/auth/login.html',
                        controller : 'loginController',
                        controllerAs : 'loginCtrl'
                    }      
                },
                data: {
                  access: AccessLevels.anon
                }        
            })   

            .state('admin.lock-user', {
                url : 'lock-user',
                views : {             
                    'child-content' : {
                        templateUrl : 'templates/auth/lock-user.html',
                        controller : 'lockUserController',
                        controllerAs : 'lockUserCtrl'
                    }
                },
                data: {
                  access: AccessLevels.anon
                } 
            })

            .state('admin.dashboard', {
                url : 'dashboard',
                views : {
                    'child-content' : {
                        templateUrl : 'templates/admin/dashboard.html',
                        resolve : {
                            departmentList : function( ActiveRecordFactory ){
                                return ActiveRecordFactory.getActiveRecordList('departments/getDepartmentList');
                            },
                            employeeList : function( ActiveRecordFactory ){
                                return ActiveRecordFactory.getActiveRecordList('employees/getEmployeeList');
                            }
                        },
                        controller : 'dashboardController'
                    }
                },
                data: {
                    access: AccessLevels.user,
                    menuCode : 1,
                    isChild : false
                },
            })

            .state('admin.employees', {               
                url : 'employee/list',
                views : {
                    'child-content' : {
                        templateUrl : 'templates/employees/list.html',    
                        resolve : {
                            getDepartmentList : function( ActiveRecordFactory ){
                                return ActiveRecordFactory.getActiveRecordList('departments/getDepartmentList');
                            }
                        },            
                        controller : 'employeeController',
                        controllerAs : 'employeeCtrl'                    
                    }
                },
                data : {
                    access: AccessLevels.user,                
                    menuCode : 2,
                    isChild : false
                }
            })  

            .state('admin.calendar', {               
                url : 'employee/calendar',
                views : {
                    'child-content' : {
                        templateUrl : 'templates/employees/employee-event-calendar.html',
                        controller : 'employeeEventCalendarController',
                        controllerAs : 'employeeEventCalendarCtrl'                  
                    }
                },
                data : {
                    access: AccessLevels.user,                
                    menuCode : 2.5,
                    isChild : false
                }
            })  

            .state('admin.reports' ,{
                url : 'reports',
                views : {
                    'child-content' : {
                        templateUrl : 'templates/reports/index.html',
                        resolve : {
                            departmentList : function( ActiveRecordFactory ){
                                return ActiveRecordFactory.getActiveRecordList('departments/getDepartmentList');
                            }
                        },
                        controller : 'reportsController'
                    }
                },
                data : {
                    access: AccessLevels.user,                
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
                    access: AccessLevels.user,                
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

            .state('admin.departments', {
                url : 'department',
                views : {
                    'child-content' : {
                        templateUrl : 'templates/departments/index.html',
                        controller : 'departmentController',
                        controllerAs : 'departmentCtrl'
                    }
                },
                data : {
                    access: AccessLevels.user,                
                    menuCode : 5,
                    isChild : false
                }
            })
           
        ;

        $locationProvider.html5Mode(true);

    }]);

    cereliApp
        .run(function($rootScope, $state, AuthenticationFactory, LocalStorageFactory) {

            $rootScope.$state = $state;              

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {  

                if( toState.url != 'login' || toState.url != 'lock-user' ) {
                    
                    if ( !AuthenticationFactory.authorize(toState.data.access)) {
                        
                        $state.go('admin.login');

                        event.preventDefault();

                    } else {

                        $rootScope.selectedMenu = toState.data.menuCode;                    
                        $rootScope.authorizeUser = angular.fromJson(LocalStorageFactory.get('auth_token'));

                        $rootScope.currentState = toState.name.split('.')[1];                 
                    }              
                }  

            });
        });

})();