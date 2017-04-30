(function() {
    angular.module('app')
        .directive('result', function() {
            return {
                restrict: 'E',
                templateUrl: 'src/result/result.html',
                controller: 'resultController as result'
            }
        })
        .controller('resultController', resultController);

    resultController.$inject = ['$scope'];
    function resultController($scope) {
        $scope.test = 'test';
    }
})();