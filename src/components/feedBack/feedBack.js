(function() {
    'use strict';

    angular.module('app')
        .controller('feedBackController', feedBackController);

    function feedBackController($scope) {

        $scope.images = [
            {
                url: 'src/img/1.svg',
                value: 1,
                halfOpacity: false
            },
            {
                url: 'src/img/2.svg',
                value: 2,
                halfOpacity: false
            },
            {
                url: 'src/img/3.svg',
                value: 3,
                halfOpacity: false
            },
            {
                url: 'src/img/4.svg',
                value: 4,
                halfOpacity: false
            },
            {
                url: 'src/img/5.svg',
                value: 5,
                halfOpacity: false
            }
        ];
    }
})();