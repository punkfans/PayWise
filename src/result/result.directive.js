(function() {
    angular.module('app')
        .directive('result', function() {
            return {
                restrict: 'E',
                templateUrl: 'src/result/result.html',
                controller: 'resultController'
            }
        })
        .controller('resultController', resultController);

    resultController.$inject = ['$scope', '$q'];
    function resultController($scope, $q) {

        $scope.cardStatus = [];

        $scope.showCard = function(index) {
            return $scope.cardStatus[index];
        };

        getDomain()
            .then(function(domain) {
                //TODO: use dynamic user_id instead of hard coding
                return getResult('10001', domain);
            })
            .then(function(cards) {
                cards.sort(function(card1, card2) {
                    return card2 - card1;
                });

                determineShownCardIndex(cards);

                $scope.cards = cards;
            })
            .catch(function(error) {
                console.log(error)
            });

        function getDomain() {
            var defer = $q.defer();
            chrome.tabs.query({
                active: true
            }, function(tabs) {
                $scope.tabs = tabs;
                var url = tabs[0].url;
                var firstDotIndex = url.indexOf('.') + 1;
                var slashIndex = url.slice(firstDotIndex).indexOf('/') + firstDotIndex + 1;

                var domain = url.slice(firstDotIndex, slashIndex - 1);

                defer.resolve(domain);
            });

            return defer.promise;
        }

        function getResult(userId, domain) {
            var defer = $q.defer();
            var baseUrl = 'https://m8n05huk4i.execute-api.us-east-1.amazonaws.com/dev/rewards';
            var url = baseUrl + '?user_id=' + userId + '&domain=' + domain;

            //use this to over come CORS issue, jsonp not working
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    var resp = JSON.parse(xhr.responseText);
                    defer.resolve(resp);
                }
            };
            xhr.send();

            return defer.promise;
        }

        function determineShownCardIndex(cards) {
            var valueArray = cards.map(function(card) {
                return card.reward;
            });

            for(var i=0; i<valueArray.length; i++) {
                $scope.cardStatus.push(valueArray[i] === valueArray[0]);
            }
        }
    }
})();