(function() {

    'use strict';

    angular.module('app')
        .controller('myCardsController', myCardsController);

    function myCardsController($scope, dataService, $http, $timeout) {
        $scope.dataService = dataService;
        $scope.showDelete = [];
        getMyCards();
        getAllCards();

        for(var i=0; i<12; i++) {
            $scope.showDelete.push(false);
        }

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
            $scope.submitting = false;
            dataService.addedCard = '';
            dataService.duplicateCard = false;
        };

        $scope.mouseOverCard = function(index) {
            $scope.showDelete[index] = true;
        };

        $scope.mouseLeaveCard = function(index) {
            $scope.showDelete[index] = false;
        };

        $scope.deleteCard = function(index) {
            //TODO change user_id to dynamic ones
            var url = 'https://m8n05huk4i.execute-api.us-east-1.amazonaws.com/dev/user-cards?user_id=' + dataService.userId + '&card_name=' + dataService.myCards[index].card_name;
            $http.delete(url)
                .then(function(deletedCard) {
                    //delete card locally
                    dataService.myCards.splice(index,1);
                    toastr.success(deletedCard.data.card_name + ' deleted');
                })
                .catch(function(error) {
                    console.log(error)
                });
        };

        $scope.addCard = function() {

            var myCard = dataService.myCards.map(function(card) {
                return card.card_name;
            });

            //check if the card already exists, if it does, return, show error
            if(myCard.indexOf(dataService.addedCard) !== -1) {
                dataService.duplicateCard = true;
                return;
            }

            $scope.submitting = true;
            var postObj = {
                user_id: dataService.userId,
                card_name: dataService.addedCard
            };
            var url = 'https://m8n05huk4i.execute-api.us-east-1.amazonaws.com/dev/user-cards';

            $http.post(url, postObj)
                .then(function(addedCard) {
                    //update my cards shown on the page if it's not a duplicate
                    dataService.myCards.push(addedCard.data);
                    toastr.success(addedCard.data.card_name + ' added!');
                    $scope.toggleEditMode();
                })
                .catch(function(error) {
                    console.log(error);
                });
        };

        function getAllCards() {
            $http.get('https://m8n05huk4i.execute-api.us-east-1.amazonaws.com/dev/cards')
                .then(function(response) {
                    dataService.allCards = response.data;
                })
                .catch(function(error) {
                    console.log(error);
                });
        }

        function getMyCards() {
            $http.get('https://m8n05huk4i.execute-api.us-east-1.amazonaws.com/dev/user-cards?user_id=' + dataService.userId)
                .then(function(response) {
                    console.log(response);
                    dataService.myCards = response.data;
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }
})();