(function() {
    angular.module('app', ['ngRoute'])
        .config(configFunction)
        .controller('main', mainController);

    function configFunction($routeProvider, $locationProvider, $compileProvider) {
        $routeProvider
            .when('/result', {
                templateUrl: 'src/components/result/result.html',
                controller: 'resultController'
            })
            .when('/myCard', {
                templateUrl: 'src/components/myCard/myCard.html',
                controller: 'myCardsController'
            })
            .when('/feedBack', {
                templateUrl: 'src/components/feedBack/feedBack.html',
                controller: 'feedBackController'
            })
            .otherwise({
                redirectTo: '/result'
            });

        //fix hash-bang issue for angular 1.6
        $locationProvider.hashPrefix('');

        //for chrome extension to get external img
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }

    mainController.$inject = ['$scope', 'navBarService'];
    function mainController($scope, navBarService) {
        var vm = this;
        //add close button for toastr
        toastr.options.closeButton = true;

        $scope.navBarService = navBarService;
    }
})();