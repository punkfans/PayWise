(function() {

    'use strict';

    angular.module('app')
        .controller('myCardsController', myCardsController);

    function myCardsController($scope, dataService, $http, $q) {
        $scope.dataService = dataService;
        $scope.showDelete = [];

        for(var i=0; i<12; i++) {
            $scope.showDelete.push(false);
        };

        $scope.openNewTab = function(cardUrl) {
            chrome.tabs.create({ url: cardUrl });
        };

        $scope.toggleEditMode = function() {
            $scope.editMode = !$scope.editMode;
        };

        $scope.mouseOverCard = function(index) {
            $scope.showDelete[index] = true;
        };

        $scope.mouseLeaveCard = function(index) {
            $scope.showDelete[index] = false;
        };

        $scope.deleteCard = function(index) {
            //delete card locally
            dataService.cards.splice(index,1);
            //TODO delete from the AWS, show a toastr when delete successfully
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