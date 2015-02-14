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

        $rootScope.$on('ConnectionGetMessage_textChat', function (event, data) {
            PhoneBook.copyGroupFromPartner(data.connection.peer, data.message.meta);
        });


    }
]);
