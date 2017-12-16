(function() {
    'use strict';

    angular.module('app')
        .filter('percentage', function() {
            return function(input) {
                input = input || '0';

                return input + '%';
            }
        });
})();