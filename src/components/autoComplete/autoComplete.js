(function() {
    'use strict';

    angular.module('app')
        .directive('autoComplete',autoComplete)
        .controller('autoCompleteController', autoCompleteController);

    function autoComplete() {
        return {
            restrict: 'E',
            scope: {
                data: '=',
                label: '@' //label of the input field
            },
            controller: 'autoCompleteController',
            templateUrl: 'src/components/autoComplete/autoComplete.html',
            link: function($scope, element) {
                $scope.avtiveItemIndex = -1;
                $scope.selected = false;
                var resultLength = 0;

                element.find('input').on('keyup', function(e) {
                    switch(e.which) {
                        //arrow up
                        case 38:
                            e.preventDefault();
                            setPreviousActiveItem();
                            break;
                        //arrow down
                        case 40:
                            e.preventDefault();
                            setNextActiveItem();
                            break;
                        //enter key
                        case 13:
                            onEnterKey();
                            break;
                        default:
                            search(e.target.value);
                    }
                });

                $scope.onBlur = function() {
                    if(resultLength === 1) {
                        $scope.selectItem(0);
                    }else if(!$scope.selected){
                        $scope.dataService.addedCard = '';
                    }
                    $scope.closeList();
                };

                function onEnterKey() {
                    if($scope.avtiveItemIndex !== -1) {
                        $scope.selectItem($scope.avtiveItemIndex);
                    }
                }

                function setNextActiveItem() {
                    var index = $scope.avtiveItemIndex + 1;
                    if(index > resultLength -1) {
                        index = 0;
                    }
                    $scope.setActiveItem(index);
                }

                function setPreviousActiveItem() {
                    var index = $scope.avtiveItemIndex - 1;
                    if(index < 0) {
                        index = resultLength -1;
                    }
                    $scope.setActiveItem(index);
                }

                function search(val) {
                    $scope.resultToShow = $scope.data.filter(function(card) {
                        return card.toLowerCase().indexOf(val.toLowerCase()) > -1;
                    });
                    resultLength = $scope.resultToShow.length;
                    $scope.showResults = true;
                    $scope.selected = false;
                    $scope.resetDuplicateCardError();
                    $scope.$digest();
                }
            }
        }
    }

    function autoCompleteController($scope, dataService, $timeout) {
        $scope.dataService = dataService;

        $scope.setActiveItem = function(index) {
            $timeout(function() {
                $scope.avtiveItemIndex = index;
            });
        };

        $scope.selectItem = function(index) {
            $timeout(function() {
                $scope.dataService.addedCard = $scope.resultToShow[index];
                $scope.showResults = false;
                $scope.avtiveItemIndex = -1;
                $scope.selected = true;

            });
        };

        $scope.closeList = function() {
            $scope.showResults = false;
            $scope.avtiveItemIndex = -1;
        };

        $scope.resetDuplicateCardError = function() {
            dataService.duplicateCard = false;
        };
    }
})();