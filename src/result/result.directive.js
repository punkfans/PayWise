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

    resultController.$inject = ['$scope', '$q', '$http', '$sce'];
    function resultController($scope, $q, $http, $sce) {
        getDomain()
            .then(function(domain) {
                $scope.domain = domain;
                return getResult('10001', domain);
            })
            .then(function(cards) {
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
            var params = {
                user_id: userId,
                domain: domain
            };

            //use this to over come CORS issue, jsonp not working
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    // WARNING! Might be evaluating an evil script!
                    var resp = JSON.parse(xhr.responseText);
                    defer.resolve(resp);
                }
            };
            xhr.send();

            return defer.promise;
        }
    }
})();