(function() {
    angular.module('app')
        .directive('result', function() {
            return {
                restrict: 'E',
                templateUrl: 'src/result/result.html'
            }
        });
})();