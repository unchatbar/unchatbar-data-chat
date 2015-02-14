'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar-data-chat.MessageProvider
 * @description
 * # peer
 * config peer connection
 */
angular.module('unchatbar-data-chat')
    .provider('Message', function () {
        var useLocalStorage = false;

        /**
         * @ngdoc methode
         * @name setLocalStorage
         * @methodOf unchatbar-data-chat.MessageProvider
         * @description
         *
         * use local storage for store peerId
         *
         */
        this.setLocalStorage = function () {
            useLocalStorage = true;
        };


        /**
         * @ngdoc service
         * @name unchatbar-data-chat.Message
         * @require $rootScope
         * @require $window
         * @require $log
         * @require $sessionStorage
         * @require $localStorage
         * @require Broker
         * @require DataConnection
         * @description
         *
         * store Text message
         *
         */
        this.$get = ['$rootScope','$window','$log', '$sessionStorage', '$localStorage', 'Broker', 'DataConnection',
            function ($rootScope,$window,$log, $sessionStorage, $localStorage, Broker, DataConnection) {

                var api = {
                    /**
                     * @ngdoc methode
                     * @name _storagePhoneBook
                     * @propertyOf unchatbar-data-chat.Message
                     * @private
                     * @returns {Object} user/group storage
                     *
                     */
                    _message: {
                        unread: [],
                        read: {}
                    },

                    /**
                     * @ngdoc methode
                     * @name initStorage
                     * @methodOf unchatbar-data-chat.Message
                     * @description
                     *
                     * init storage
                     */
                    initStorage: function () {
                        var storage = useLocalStorage ? $localStorage : $sessionStorage;
                        this._message = storage.$default({
                            textMessage: {
                                unread: [],
                                read: {}
                            }
                        }).textMessage;
                    },

                    /**
                     * @ngdoc methode
                     * @name initStorage
                     * @methodOf unchatbar-data-chat.Message
                     * @params {Array} users peer id from users
                     * @params {String} message text
                     * @params {String} channel name of chat channel
                     * @description
                     *
                     * init storage
                     */
                    send: function (users, message, channel) {
                        var date = new $window.Date();
                        var message = {
                            channel: channel,
                            text: message,
                            meta: {
                                sendStamp :date
                            }
                        };
                        _.forEach(users, function (user) {
                            DataConnection.send(user, '', 'Message', message);
                        });
                        try {
                            this.storeMessage(Broker.getPeerId(), message);
                        } catch(e) {
                            $log.error(e);
                        }

                    },

                    /**
                     * @ngdoc methode
                     * @name storeMessage
                     * @methodOf unchatbar-data-chat.Message
                     * @params {String} peerId from sender
                     * @params {Object} message object (need channel)
                     * @description
                     *
                     * store message
                     */
                    storeMessage: function (from, message) {
                        var channel = message.channel || '';
                        if (channel){
                            this._message.unread.push({channel :channel, message: message, from: from});
                        } else {
                            throw 'could not save message, channel is not defined';
                        }
                        /**
                         * @ngdoc event
                         * @name MessageUpdateUnreadMessage
                         * @eventOf unchatbar-contact.Message
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * broadcast unread list was update
                         *
                         */
                        $rootScope.$broadcast('MessageUpdateUnreadMessage', {});
                    },

                    /**
                     * @ngdoc methode
                     * @name getMessageFromChannel
                     * @methodOf unchatbar-data-chat.Message
                     * @params {String} channel id fo channel
                     * @return {Array} list of messages from channel
                     * @description
                     *
                     * get all messages from channel
                     */
                    getMessageFromChannel: function (channel) {
                        this._message.read[channel] = this._message.read[channel] || [];
                        var moveMessage = false;
                        while (-1 !== _.findIndex( this._message.unread, { 'channel': channel })) {
                            var index = _.findIndex( this._message.unread, { 'channel': channel })
                            this._message.read[channel].push(this._message.unread[index]);
                            this._message.unread.splice(index,1);
                            moveMessage = true;
                        }
                       if(moveMessage === true) {
                            /**
                             * @ngdoc event
                             * @name MessageUpdateReadMessage
                             * @eventOf unchatbar-contact.Message
                             * @eventType broadcast on root scope
                             * @description
                             *
                             * broadcast read list was update
                             *
                             */
                            $rootScope.$broadcast('MessageUpdateReadMessage', {});
                        }
                        return this._message.read[channel];
                    },

                    /**
                     * @ngdoc methode
                     * @name getMessageFromChannel
                     * @methodOf unchatbar-data-chat.Message
                     * @params {String} channel id fo channel
                     * @return {Object} map of all unread messages
                     * @description
                     *
                     * get all messages from channel
                     */
                    getUnreadMessageMap: function () {
                        return this._message.unread;
                    }

                };

                return api;
            }
        ];
    }
);
