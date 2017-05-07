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

        $scope.addCard = function() {
            var postObj = {
                user_id: 10001,
                card_name: dataService.addedCard
            };
            var url = 'https://m8n05huk4i.execute-api.us-east-1.amazonaws.com/dev/user-cards';

            $http.post(url, postObj)
                .then(function(data) {
                    console.log(data);
                    //TODO toastr not working now..
                    toastr.success('card added!')
                })
                .catch(function(error) {
                    console.log(error);
                });
        };

        getAllCards();

        function getAllCards() {
            $http.get('https://m8n05huk4i.execute-api.us-east-1.amazonaws.com/dev/cards')
                .then(function(response) {
                    dataService.allCards = response.data;
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }
})();