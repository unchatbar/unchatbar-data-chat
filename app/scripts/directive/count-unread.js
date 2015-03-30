'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar-data-chat.directive:unDataChatUnreadMessage
 * @restrict E
 * @description
 *
 * message box
 *
 */
angular.module('unchatbar-data-chat').directive('unDataChatCountUnreadMessage', [
    function () {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'views/unchatbar-data-chat/count-unread-message.html',
            controller: 'unDataChatText',
            link: function (scope) {
                scope.$on('MessageUpdateUnreadMessage', function () {
                    getUnreadMessage();
                });
                scope.$on('MessageUpdateReadMessage', function () {
                    getUnreadMessage();
                });

                function getUnreadMessage () {
                    scope.getUnreadMessageList();
                }
                getUnreadMessage();
            }
        };
    }
]);
