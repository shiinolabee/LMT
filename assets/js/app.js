'use strict';


var cereliApp = angular.module('cereliApp', [ 'angular.filter', 'angularMoment', 'cereliDirectives', 'mwl.calendar', 'ngAnimate','ui.bootstrap', 'ui.router' ]);


cereliApp.config([ '$stateProvider', '$locationProvider', '$urlRouterProvider', 'AccessLevels' , function( $stateProvider, $locationProvider, 
        $urlRouterProvider, AccessLevels ){

    $urlRouterProvider            
        .otherwise("/dashboard");

    $stateProvider      

        .state('login', {
            url : '/login',
            views : {
                'parent-content' : {
                    templateUrl : 'templates/auth/login.html',
                    controller : 'loginController',
                    controllerAs : 'loginCtrl'
                }      
            },
            data: {
              access: AccessLevels.anon
            }        
        })

        .state('lock-user', {
            url : '/lock-user',
            views : {
                'parent-content' : {
                    templateUrl : 'templates/auth/lock-user.html',
                    controller : 'lockUserController',
                    controllerAs : 'lockUserCtrl'
                }
            },
            data: {
              access: AccessLevels.anon
            } 
        })

        .state('register', {
            url : '/register',
            views : {
                'parent-content' : {
                    templateUrl : 'templates/auth/register.html',
                    controller : 'registerController',
                    controllerAs : 'registerCtrl'
                }
            },
            data: {
              access: AccessLevels.anon
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
                }
            },
            data: {
                access: AccessLevels.user,
                menuCode : 1,
                isChild : false
            },
        })

        .state('admin.employees', {               
            url : 'employee/time_records',
            views : {
                'child-content' : {
                    templateUrl : 'templates/employees/list.html',    
                    resolve : {
                        getDepartmentList : function( activeRecordService ){
                            return activeRecordService.getActiveRecordList('departments/getDepartmentList');
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
                    templateUrl : 'templates/reports/index.html'
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
    .config(function(calendarConfig) {
     
        calendarConfig.dateFormatter = 'moment'; //use either moment or angular to format dates on the calendar. Default angular. Setting this will override any date formats you have already set.

        calendarConfig.allDateFormats.moment.date.hour = 'HH:mm a'; //this will configure times on the day view to display in 24 hour format rather than the default of 12 hour

        calendarConfig.allDateFormats.moment.title.day = 'ddd D MMM'; //this will configure the day view title to be shorter

        calendarConfig.i18nStrings.weekNumber = 'Week {week}'; //This will set the week number hover label on the month view

        calendarConfig.displayAllMonthEvents = true; //This will display all events on a month view even if they're not in the current month. Default false.

        calendarConfig.showTimesOnWeekView = true; //Make the week view more like the day view, with the caveat that event end times are ignored.

        console.log('Loaded Calendar Config Successful');
    });

cereliApp
    .run(function($rootScope, $state, Auth, LocalService) {

        $rootScope.$state = $state;  

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {       

            if( toState.url != '/login' || toState.url != '/logout' || toState.url != '/lock-user' ) {

                if ( !Auth.authorize(toState.data.access)) {
                    
                    $state.go('login');

                    event.preventDefault();

                } else {                   

                    $rootScope.selectedMenu = toState.data.menuCode;

                    $rootScope.isAuthenticated = true;
                    $rootScope.authorizeUser = angular.fromJson(LocalService.get('auth_token'));

                    // console.log($rootScope.authorizeUser)
                    $rootScope.currentState = toState.name.split('.')[1];                 
                }              
            }  

        });
    });