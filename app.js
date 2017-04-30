(function() {
    angular.module('app', ['ngRoute', 'ngSanitize'])
        .config(configFunction)
        .controller('main', mainController);

    function configFunction($routeProvider, $locationProvider) {
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
    }

    mainController.$inject = ['$scope'];
    function mainController($scope) {
        var vm = this;
    }
})();