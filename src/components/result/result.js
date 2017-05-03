(function() {
    angular.module('app')
        .controller('resultController', resultController);

    resultController.$inject = ['$scope', '$q', 'dataService'];
    function resultController($scope, $q, dataService) {

        $scope.dataService = dataService;

        $scope.openNewTab = function(cardUrl) {
            chrome.tabs.create({ url: cardUrl });
        };

        if(!dataService.userId) {
            getUserId()
                .then(function() {
                    console.log(dataService.userId);
                    if(!dataService.userId) {
                        setUserId();
                    }
                })
        }

        //http call only happens when the page loads for the first time
        if(!dataService.cards) {
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

                    dataService.cards = cards;
                })
                .catch(function(error) {
                    //there is an error during getting results
                    console.log(error)
                });
        }

        //for dev only, to clear the chrome storage
        function clearChromeStorage() {
            chrome.storage.sync.set({'userId': ''}, function() {
                dataService.userId = '';
                console.log(dataService.userId);
            });
        }

        function getUserId() {
            var defer = $q.defer();
            chrome.storage.sync.get('userId', function(userIdObj) {
                dataService.userId = userIdObj.userId;
                defer.resolve();
            });

            return defer.promise;
        }

        function setUserId() {
            var id = Math.floor(Math.random()*90000) + 10000;
            chrome.storage.sync.set({'userId': id}, function() {
                console.log('saved!');
                dataService.userId = id;
            });
        }

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
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var resp = JSON.parse(xhr.responseText);
                    if(resp.errorMessage) {
                        //TODO: refine the error msg to differentiate reason and show different page
                        defer.reject(resp.errorMessage);
                    }else {
                        defer.resolve(resp);
                    }
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
                dataService.cardStatus.push(valueArray[i] === valueArray[0]);
            }
        }
    }
})();