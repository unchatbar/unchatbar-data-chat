'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar-data-chat.directive:unDataChatSendBox
 * @restrict E
 * @description
 *
 * message send file
 *
 */
angular.module('unchatbar-data-chat').directive('unDataChatSendFile', [
    function () {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: function(element,scope){
                return scope.customTemplateUrl || 'views/unchatbar-data-chat/send-file.html';
            },
            controller: 'unDataChatText',
            scope: {
                channel: '@',
                userMap: '=',
                customTemplateUrl: '@'
            },
            link: function (scope) {

                scope.$on('MessageUpdateUnreadMessage', function () {
                    getListByChannel();
                });
                scope.$watch('channel',function(){
                    getListByChannel();
                });
                function getListByChannel () {
                    if (scope.channel) {
                        scope.getMessageListByChannel(scope.channel);
                    }
                }
            }
        };
    }
]);
