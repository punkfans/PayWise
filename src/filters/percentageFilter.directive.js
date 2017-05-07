(function() {
    'use strict';

    angular.module('app')
        .filter('percentage', function() {
            return function(input) {
                input = input || '';

                return input + '%';
            }
        });
})();