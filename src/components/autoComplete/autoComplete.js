(function() {
    'use strict';

    angular.module('app')
        .directive('autoComplete',autoComplete)
        .controller('autoCompleteController', autoCompleteController);

    function autoComplete() {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            controller: 'autoCompleteController',
            templateUrl: 'src/components/autoComplete/autoComplete.html',
            link: function($scope, element) {

            }
        }
    }

    function autoCompleteController($scope) {
        console.log('sd', $scope.data);
    }
})();