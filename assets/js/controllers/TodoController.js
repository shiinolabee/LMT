cereliApp
    .controller('TodoController', [ '$scope', '$rootScope', 'TodoService' , function( $scope, $rootScope, TodoService ) {

        $scope.formData = {};

        $scope.todos = [];

        TodoService.getTodos().then(function( response ){
            $scope.todos = response;
        });

        $scope.addTodo = function(){

            TodoService.addTodo($scope.formData).then(function( response ){
                $scope.todos.push($scope.formData);
                $scope.formData = {};
            }); 

        };

        $scope.removeTodo = function( todo ){

            TodoService.removeTodo(todo).then(function( response ){
                $scope.todos.splice($scope.todos.indexOf(todo), 1);
            });

        };

    }])