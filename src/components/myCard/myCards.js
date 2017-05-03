(function() {

    'use strict';

    angular.module('app')
        .controller('myCardsController', myCardsController);

    function myCardsController($scope, dataService) {
        $scope.dataService = dataService;

        $scope.openNewTab = function(cardUrl) {
            chrome.tabs.create({ url: cardUrl });
        };
    }
})();