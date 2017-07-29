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
                halfOpacity: false
            },
            {
                url: 'src/img/Confused.png',
                value: 2,
                halfOpacity: false
            },
            {
                url: 'src/img/Happy.png',
                value: 3,
                halfOpacity: false
            }
        ];

        $scope.rate = function(index) {
            angular.forEach($scope.images, function(image, idx) {
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