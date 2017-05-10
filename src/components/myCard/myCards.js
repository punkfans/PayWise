(function() {

    'use strict';

    angular.module('app')
        .controller('myCardsController', myCardsController);

    function myCardsController($scope, dataService, $http, $timeout) {
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
            if($scope.editMode) {
                $timeout(function() {
                    $('#addCard').focus();
                },100);
            }
        };

        $scope.mouseOverCard = function(index) {
            $scope.showDelete[index] = true;
        };

        $scope.mouseLeaveCard = function(index) {
            $scope.showDelete[index] = false;
        };

        $scope.deleteCard = function(index) {
            //TODO change user_id to dynamic ones
            var url = 'https://m8n05huk4i.execute-api.us-east-1.amazonaws.com/dev/user-cards?user_id=' + dataService.userId + '&card_name=' + dataService.cards[index].card_name;
            $http.delete(url)
                .then(function(deletedCard) {
                    //delete card locally
                    dataService.cards.splice(index,1);
                    toastr.success(deletedCard.data.card_name + ' deleted');
                })
                .catch(function(error) {
                    console.log(error)
                });
        };

        $scope.addCard = function() {
            var postObj = {
                user_id: dataService.userId,
                card_name: dataService.addedCard
            };
            var url = 'https://m8n05huk4i.execute-api.us-east-1.amazonaws.com/dev/user-cards';

            $http.post(url, postObj)
                .then(function(addedCard) {
                    //update my cards shown on the page
                    dataService.cards.push(addedCard.data);
                    toastr.success(addedCard.data.card_name + ' added!')
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