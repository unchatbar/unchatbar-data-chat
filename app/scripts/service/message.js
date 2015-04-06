'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar-data-chat.Message
 * @description
 * # peer
 * message service
 */
angular.module('unchatbar-data-chat')
    .service('Message', ['$rootScope', '$window', '$q', '$log', 'Broker', 'DataConnection',
        function ($rootScope, $window, $q, $log, Broker, DataConnection) {


            var api = {
                /**
                 * @ngdoc methode
                 * @name _db
                 * @propertyOf unchatbar-data-chat.Message
                 * @private
                 * @returns {Object} databse connector
                 *
                 */
                _db: null,

                /**
                 * @ngdoc methode
                 * @name DBVERSION
                 * @propertyOf unchatbar-data-chat.Message
                 * @private
                 * @returns {Number} databse version
                 *
                 */
                DBVERSION: 1,

                /**
                 * @ngdoc methode
                 * @name initStorage
                 * @methodOf unchatbar-data-chat.Message
                 * @description
                 *
                 * init storage
                 */
                initStorage: function () {
                    this._db = new window.Dexie('unTextChat');
                    this._db.version(this.DBVERSION).stores(
                        {
                            messages: "&messageId,sendId,sendStamp,channel,status,from,meta"
                        }
                    );
                    this._db.open();
                },

                /**
                 * @ngdoc methode
                 * @name initStorage
                 * @methodOf unchatbar-data-chat.Message
                 * @params {Array} users peer id from users
                 * @params {String} text message text
                 * @params {String} channel name of chat channel
                 * @description
                 *
                 * init storage
                 */
                send: function (users, text, channel) {
                    var message = this._createMessage(text, channel);
                    var sendId = '';
                    _.forEach(users, function (user) {
                        sendId = DataConnection.send(user.id, 'dataChat', message,sendId) || sendId;
                    }.bind(this));
                    var storeMessage = _.clone(message);
                    storeMessage.sendId = sendId;
                    this.storeMessage(Broker.getPeerId(), storeMessage);
                },

                /**
                 * @ngdoc methode
                 * @name clientReadMessage
                 * @methodOf unchatbar-data-chat.Message
                 * @params {Array} users peer id from users
                 * @params {Object} sendId sendes message id
                 * @description
                 *
                 * client read message - store this info to the sended message
                 */
                clientReadMessage: function (sendId) {
                    this._db.messages.where("sendId").equals(sendId).modify({"clientRead": true}).then(function () {
                        /**
                         * @ngdoc event
                         * @name MessageUpdateClientRead
                         * @eventOf unchatbar-data-chat.Message
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * broadcast client read message
                         *
                         */
                        $rootScope.$broadcast('MessageUpdateClientRead', {});
                    });

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
                    message.from = from;
                    this._db.messages.add(message).then(function () {
                        /**
                         * @ngdoc event
                         * @name MessageUpdateUnreadMessage
                         * @eventOf unchatbar-data-chat.Message
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * broadcast unread list was update
                         *
                         */
                        $rootScope.$broadcast('MessageUpdateUnreadMessage', {
                            unread: {
                                channel: message.channel,
                                message: message,
                                from: from
                            }
                        });
                    });

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
                    var defer = $q.defer();
                    this._db.messages.where('channel').equals(channel).modify({'status': 'read'}).then(function () {
                        /**
                         * @ngdoc event
                         * @name MessageUpdateReadMessage
                         * @eventOf unchatbar-data-chat.Message
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * broadcast read list was update
                         *
                         */
                        $rootScope.$broadcast('MessageUpdateReadMessage', {});
                        this._db.messages.where('channel').equals(channel).toArray(defer.resolve);
                    }.bind(this));
                    return defer.promise;
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
                    var defer = $q.defer();
                    this._db.messages.where("status").equals('unread').toArray(defer.resolve);
                    return defer.promise;
                },

                /**
                 * @ngdoc methode
                 * @name _createMessage
                 * @methodOf unchatbar-data-chat.Message
                 * @params {String} text message text
                 * @params {String} channel name of chat channel
                 * @description
                 *
                 * create a new message object
                 */
                _createMessage: function (text, channel) {
                    var date = new $window.Date();

                    return {
                        channel: channel,
                        messageId: this._createUUID(),
                        sendStamp: date.getTime(),
                        meta: {
                            date: date,
                            text: text
                        },
                        sendId: '',
                        status: 'unread',
                        clientRead: false
                    };
                },

                /* @ngdoc methode
                 * @name _createUUID
                 * @methodOf unchatbar-data-chat.Message
                 * @private
                 * @description
                 *
                 * generate a uui id
                 *
                 */
                _createUUID: function () {
                    function _p8(s) {
                        var p = (Math.random().toString(16) + '000000000').substr(2, 8);
                        return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
                    }

                    return _p8() + _p8(true) + _p8(true) + _p8();
                }

            };

            return api;
        }
    ]);

