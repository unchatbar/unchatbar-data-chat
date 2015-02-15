'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar-data-chat.directive:unDataChatMessageBox
 * @restrict E
 * @description
 *
 * message box
 *
 */
angular.module('unchatbar-data-chat').directive('unDataChatMessageBox', [
    function () {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'views/unchatbar-data-chat/message-box.html',
            controller: 'unDataChatText',
            scope: {
                channel: '@',
                userMap: '='
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