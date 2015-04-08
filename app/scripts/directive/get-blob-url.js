'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar-data-chat.directive:unfileReader
 * @restrict E
 * @description
 *
 * read file
 *
 */
angular.module('unchatbar-data-chat').directive('unGetBlobUrl', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        scope : {
            unUrl : '=',
            blobUrl : '='
        },
        link: function (scope, element, attrs) {
            if(scope.unUrl && scope.unUrl.constructor === ArrayBuffer) {
                var dataView = new Uint8Array(scope.unUrl);
                var dataBlob = new Blob([dataView]);
                scope.blobUrl = window.URL.createObjectURL(dataBlob);
            } else if (scope.unUrl) {
                scope.blobUrl = window.URL.createObjectURL(scope.unUrl);
            }
        }
    };
}]);