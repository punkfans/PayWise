(function() {
    angular.module('app')
        .directive('result', function() {
            return {
                restrict: 'E',
                templateUrl: 'result.html'
            }
        });
})();