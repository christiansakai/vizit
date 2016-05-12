app.controller('HomeCtrl', function($scope, VisualizeCodeFactory) {
    $scope.code = '// input your code here and click on "Visualize"\
    \nfunction fact(n) {\
  \nif (n == 0) {\
    \n   return 1;\
  \n}\
  \nelse {\
    \n   console.log("THERE ARE  " + n + " oranges!!!");\
    \n   return n * fact(n-1);\
  \n}\
\n}\
\n\nfact(10);'

	$scope.render = VisualizeCodeFactory.executionVisualizer.renderDataStructures;

    $scope.selection = 'edit';
    $scope.submitCode = function(code) {
        // debugger;
        VisualizeCodeFactory.submitCode(code)
            .then(function(response) {
                $scope.trace = response.trace;
                return new VisualizeCodeFactory.executionVisualizer("pyOutputPane", response);
            });
    };
    $scope.set = function(selection) {
        $scope.selection = selection;
    };

});

app.directive('visualize', function() {
    return {
        restrict: 'E',
        templateUrl: 'js/home/visualize.html'
    };
});
