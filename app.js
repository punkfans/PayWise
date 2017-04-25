(function() {
    angular.module('app', ['ngMaterial'])
        .controller('main', mainController);

    function mainController($scope) {
        var vm = this;

        $scope.currentNavItem = 'page1';
    }
})();