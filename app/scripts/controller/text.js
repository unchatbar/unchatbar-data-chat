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
angular.module('unchatbar-data-chat').controller('unDataChatText', ['$scope','$filter','Message',
    function ($scope,$filter, Message) {

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
         * @params {Array} users peer id from users
         * @params {String} channel name of chat channel
         * @description
         *
         * send message to selected users from phone-book
         * directive call sendTextMessage by help of attribute (userIds,channel)
         */
        $scope.sendTextMessage = function (user,channel) {
            Message.send(user,$scope.text,channel);
        };

        /**
         * @ngdoc methode
         * @name getMessageListByChannel
         * @methodOf unchatbar-data-chat.controller:unDataChatText
         * @description
         *
         * read message by channel
         *
         */
        $scope.getMessageListByChannel = function (channel) {
            $scope.messageList = Message.getMessageFromChannel(channel);
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

        /**
         * @ngdoc methode
         * @name getFormateDate
         * @methodOf unchatbar-data-chat.controller:unDataChatText
         * @description
         *
         * get a formate date string
         *
         */
        $scope.getFormateDate = function(date){
            return new Date(date).toISOString();

        }

    }
]);
