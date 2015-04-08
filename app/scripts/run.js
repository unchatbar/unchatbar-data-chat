'use strict';
/**
 * @ngdoc overview
 * @name unchatbar-data-chat
 * @description
 * # unchatbar-data-chat-connection
 *
 * Main module of the application.
 */
angular.module('unchatbar-data-chat').run(['$rootScope', 'Message',
    function ($rootScope, Message) {
        Message.initStorage();

        $rootScope.$on('ConnectionGetMessage_dataChat', function (event, data) {
            Message.storeMessage(data.peerId, data.message.meta);
        });

        $rootScope.$on('ConnectionGetMessage_getFile', function (event, data) {
            console.log(data);
            Message.sendBlobFromMessage(data.peerId, data.message.meta.messageId);
        });

        $rootScope.$on('ConnectionGetMessage_sendFileBlob', function (event, data) {
            Message.storeFileBlob(data.message.meta.messageId,data.message.meta.blob);
        });


        $rootScope.$on('ConnectionGetMessage_readMessage' , function(event, data){
            Message.clientReadMessage(data.message.id);
        });
    }
]);
