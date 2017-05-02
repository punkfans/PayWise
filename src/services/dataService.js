(function() {
    'use strict';

    angular.module('app')
        .service('dataService', dataService);

    function dataService() {
        var service = this;
        service.cardStatus = [];

        return service;
    }

})();