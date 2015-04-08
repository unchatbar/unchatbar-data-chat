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
angular.module('unchatbar-data-chat').directive('unFileReader', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            //var model = $parse(attrs.fileModel);
            //var modelSetter = model.assign;
            element.bind('change', function () {
                var file  = element[0].files[0];
                //Only for store Blob move in add Storage
                var reader = new FileReader();
                reader.onload = function (e) {
                    //console.log(e.target.result);
                    var data = e.target.result;
                    var dataView = new Uint8Array(data);
                    var blobFile = new Blob([dataView]);
                    scope.sendFileMessage(scope.userMap,scope.channel,blobFile,file);
                };
                reader.onerror = function (e) {
                    console.error(e);
                };
                reader.readAsArrayBuffer(file);

            });

        }
    };
}]);