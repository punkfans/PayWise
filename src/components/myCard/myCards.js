(function() {

    'use strict';

    angular.module('app')
        .controller('myCardsController', myCardsController);

    function myCardsController($scope, dataService) {
        $scope.dataService = dataService;
    }
})();