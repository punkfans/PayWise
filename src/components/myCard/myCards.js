(function() {

    'use strict';

    angular.module('app')
        .controller('myCardsController', myCardsController);

    function myCardsController($scope, dataService, $http, $q) {
        $scope.dataService = dataService;

        $scope.openNewTab = function(cardUrl) {
            chrome.tabs.create({ url: cardUrl });
        };

        $scope.toggleEditMode = function() {
            $scope.editMode = !$scope.editMode;
        };

        getAllCards();

        function getAllCards() {
            $http.get('https://m8n05huk4i.execute-api.us-east-1.amazonaws.com/dev/cards')
                .then(function(response) {
                    dataService.allCards = response.data;
                    console.log('all card loaded', dataService.allCards)
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }
})();