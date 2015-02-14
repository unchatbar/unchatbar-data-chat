'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar-data-chat.controller:unDataChatText
 * @require $scope
 * @require Message
 * @require PhoneBook
 * @description
 *
 * text message
 *
 */
angular.module('unchatbar-data-chat').controller('unDataChatText', ['$scope','Message',
    function ($scope, Message) {

        /**
         * @ngdoc property
         * @name messageList
         * @propertyOf unchatbar-data-chat.controller:unDataChatText
         * @returns {Array} list of messages for selcted channel
         */
        $scope.messageList = $scope.messageList || [];

        /**
        * @ngdoc property
        * @name unreadMessageList
        * @propertyOf unchatbar-data-chat.controller:unDataChatText
        * @returns {Object} list of all unread messages
        */
        $scope.unreadMessageMap = $scope.messageList || {};

        /**
         * @ngdoc property
         * @name text
         * @propertyOf unchatbar-data-chat.controller:unDataChatText
         * @returns {String} list of clients
         */
        $scope.text = $scope.text || '';

        /**
         * @ngdoc methode
         * @name sendTextMessage
         * @methodOf unchatbar-data-chat.controller:unDataChatText
         * @description
         *
         * send message to selected users from phone-book
         * directive call sendTextMessage by help of attribute (userIds,channel)
         */
        $scope.sendTextMessage = function (user,channel) {           
            $scope.messageList = Message.send(users,$scope.text,channel);
        };

        /**
         * @ngdoc methode
         * @name readActiveMessageList
         * @methodOf unchatbar-data-chat.controller:unDataChatText
         * @description
         *
         * read message by channel
         *
         */
        $scope.getActiveMessageList = function () {
            $scope.messageList = Message.getMessageFromChannel();
        };

        /**
         * @ngdoc methode
         * @name getUnreadMessageList
         * @methodOf unchatbar-data-chat.controller:unDataChatText
         * @description
         *
         * get all unread messages
         *
         */
        $scope.getUnreadMessageList = function () {
            $scope.unreadMessageList = Message.getUnreadMessageMap();
        };

    }
]);
