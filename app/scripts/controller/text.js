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
angular.module('unchatbar-data-chat').controller('unDataChatText', ['$scope','$q', '$filter', 'Message','Broker',
    function ($scope,$q, $filter, Message, Broker) {


        $scope.options = {
            linkTarget: '_blank',
            basicVideo: true,
            pdf: {
                embed: true                       //to show pdf viewer.
            },
            image: {
                'embed': true
            },
            audio     : {
                embed: true                       //to allow embedding audio player if link to

            },
            video: {
                embed: true,
                width: 500,
                ytTheme: 'light',
                details: true,
                ytAuthKey: 'AIzaSyAQONTdSSaKwqB1X8i6dHgn9r_PtusDhq0'
            },
            code: {
                highlight: true,               //to allow code highlighting of code written in markdown
                //requires highligh.js (https://highlightjs.org/) as dependency.
                lineNumbers: false               //to show line numbers
            }
        };

        /**
         * @ngdoc property
         * @name ownPeerId
         * @propertyOf unchatbar-data-chat.controller:unDataChatText
         * @returns {String} own peer id
         */
        $scope.ownPeerId = Broker.getPeerIdFromStorage();

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
        $scope.sendTextMessage = function (user, channel) {
            Message.send(user, $scope.text, channel);
        };

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
        $scope.sendFileMessage = function (user, channel,blobFile,file) {
             Message.sendFile(user, file,blobFile, channel);
        };

        $scope.getFileFromClient = function(from,messageId){
            Message.getFileFromClient(from,messageId);
        }

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
            Message.getMessageFromChannel(channel).then(function(messages){
                $scope.messageList =messages;
            });
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
            Message.getUnreadMessageMap().then(function(messages){
                $scope.unreadMessageList = messages;
            });
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
        $scope.getFormateDate = function (date) {
            return new Date(date).toISOString();

        }


    }
]);
