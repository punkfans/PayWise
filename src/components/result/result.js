(function() {
    angular.module('app')
        .controller('resultController', resultController);

    resultController.$inject = ['$scope', '$q', 'dataService', '$location'];
    function resultController($scope, $q, dataService, $location) {

        $scope.dataService = dataService;

        $scope.openNewTab = function(cardUrl) {
            chrome.tabs.create({ url: cardUrl });
        };

        $scope.goToMycard = function() {
            //redirect to myCard
            $location.path('/myCard');
        };

        //get user_id, set it if there is no user_id
        if(!dataService.userId) {
            getUserId()
                .then(function() {
                    console.log(dataService.userId);
                    if(!dataService.userId) {
                        setUserId();
                    }
                })
        }

        getDomain()
            .then(function(domain) {
                //TODO: use dynamic user_id instead of hard coding
                return getResult(dataService.userId, domain);
            })
            .then(function(cards) {

                determineShownCardIndex(cards);

                dataService.cards = cards;
            })
            .catch(function(error) {
                //there is an error during getting results
                console.log(error)
            });

        //for dev only, to clear the chrome storage
        function clearChromeStorage() {
            chrome.storage.sync.set({'userId': ''}, function() {
                dataService.userId = '';
                console.log(dataService.userId);
            });
        }

        //generating UUID as user_id
        function getUUID() {
            var s4 = function() {
                return Math.floor((1+Math.random())*0x10000).toString(16).substring(1);
            };

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }

        function getUserId() {
            var defer = $q.defer();
            chrome.storage.sync.get('userId', function(userIdObj) {
                dataService.userId = userIdObj.userId;
                //for clear user_id, dev only!
                //clearChromeStorage();
                defer.resolve();
            });

            return defer.promise;
        }

        function setUserId() {
            id = getUUID();
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
            dataService.cardStatus = [];
            var valueArray = cards.map(function(card) {
                return card.reward;
            });

            for(var i=0; i<valueArray.length; i++) {
                dataService.cardStatus.push(valueArray[i] === valueArray[0]);
            }
        }
    }
})();