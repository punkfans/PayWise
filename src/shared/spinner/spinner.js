(function() {
    'use strict';

    angular.module('app')
        .directive('spinner', spinnerFunction);

    function spinnerFunction() {
        return {
            restrict: 'E',
            template: '<div></div>'
        }
    }
})();