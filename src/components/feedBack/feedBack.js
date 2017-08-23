(function() {
    'use strict';

    angular.module('app')
        .controller('feedBackController', feedBackController);

    function feedBackController($scope, $http) {

        var rating;

        $scope.images = [
            {
                url: 'src/img/Sad.png',
                value: 1,
                halfOpacity: true,
                clicked: false
            },
            {
                url: 'src/img/Confused.png',
                value: 2,
                halfOpacity: true,
                clicked: false
            },
            {
                url: 'src/img/Happy.png',
                value: 3,
                halfOpacity: true,
                clicked: false
            }
        ];

        $scope.mouseOver = function(index) {
            $scope.images[index].halfOpacity = false;
        };

        $scope.mouseLeave = function(index) {
            if(!$scope.images[index].clicked) {
                $scope.images[index].halfOpacity = true;
            }
        };

        $scope.rate = function(index) {
            angular.forEach($scope.images, function(image, idx) {
                image.clicked = (idx === index);
                image.halfOpacity = !(idx === index);
            });

            rating = index + 1;
        };

        $scope.submitFeedBack = function() {
            var postObj = {
                rating: rating,
                message: $scope.comment,
                email: $scope.email,
                type: 'rating'
            };

            var url = 'https://m8n05huk4i.execute-api.us-east-1.amazonaws.com/dev/feedbacks';
            $scope.submitting = true;

            $http.post(url, postObj)
                .then(function() {
                    $scope.submitted = true;
                });

        };
    }
})();