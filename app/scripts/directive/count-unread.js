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
            templateUrl: function(element,scope){
                return scope.customTemplateUrl || 'views/unchatbar-data-chat/count-unread-message.html';
            },
            scope : {
                customTemplateUrl: '@'
            },
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
