(function() {
    angular.module('app', ['ngRoute'])
        .config(configFunction)
        .controller('main', mainController);

    function configFunction($routeProvider, $locationProvider, $compileProvider) {
        $routeProvider
            .when('/result', {
                templateUrl: 'src/result/result.html',
                controller: 'resultController'
            })
            .when('/myCard', {
                templateUrl: 'src/myCard/myCard.html'
            })
            .when('/feedBack', {
                templateUrl: 'src/feedBack/feedBack.html'
            })
            .otherwise({
                redirectTo: '/result'
            });

        //fix hash-bang issue for angular 1.6
        $locationProvider.hashPrefix('');

        //for chrome extension to get external img
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }

    mainController.$inject = ['$scope'];
    function mainController($scope) {
        var vm = this;
    }
})();