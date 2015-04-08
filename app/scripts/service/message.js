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
                            messages: "&id,messageId,sendId,sendStamp,channel,status,from,meta,file"
                        }
                    );
                    this._db.open();
                },

                /**
                 * @ngdoc methode
                 * @name getFileFromClient
                 * @methodOf unchatbar-data-chat.Message
                 * @params {String} receiver receiver of client
                 * @params {String} messageId id of file message
                 * @description
                 *
                 * aks client for blob file
                 */
                getFileFromClient : function(receiver,messageId){
                    this._db.messages.where('messageId').equals(messageId).modify(function(message) {
                        message.file.sendGetFile = true;
                    }).then(function(){
                        /**
                         * @ngdoc event
                         * @name MessageUpdateFile
                         * @eventOf unchatbar-data-chat.Message
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * broadcast file was download
                         *
                         */
                        $rootScope.$broadcast('MessageUpdateFile', {});
                        DataConnection.send(receiver, 'getFile', {messageId :messageId});
                    });
                },

                /**
                 * @ngdoc methode
                 * @name sendBlobFromMessage
                 * @methodOf unchatbar-data-chat.Message
                 * @params {String} receiver receiver of client
                 * @params {String} messageId id of file message
                 * @description
                 *
                 * send blob file to client
                 */
                sendBlobFromMessage : function(receiver, messageId) {
                    this._db.messages.where('messageId').equals(messageId).each(function (message) {
                        DataConnection.send(receiver, 'sendFileBlob', {
                            messageId : messageId,
                            blob :message.file.blob
                        });
                    });
                },

                /**
                 * @ngdoc methode
                 * @name storeFileBlob
                 * @methodOf unchatbar-data-chat.Message
                 * @params {String} messageId blob of upload file
                 * @params {String} blob blob of file
                 * @description
                 *
                 * store blob file from client
                 */
                storeFileBlob : function(messageId,blob) {
                    this._db.transaction("rw", this._db.messages, function () {
                        this._db.messages.where('messageId').equals(messageId).modify(function(message) {
                            message.file.blob = blob;
                        }).then(function(){
                            /**
                             * @ngdoc event
                             * @name MessageUpdateFile
                             * @eventOf unchatbar-data-chat.Message
                             * @eventType broadcast on root scope
                             * @description
                             *
                             * broadcast file was download
                             *
                             */
                            $rootScope.$broadcast('MessageUpdateFile', {});
                        });
                    }.bind(this));
                },

                /**
                 * @ngdoc methode
                 * @name sendFile
                 * @methodOf unchatbar-data-chat.Message
                 * @params {Array} users peer id from users
                 * @params {Object} upload file
                 * @params {String} blobfile blob of upload file
                 * @params {String} channel channel send to file
                 * @description
                 *
                 * send file
                 */
                sendFile : function(users, file,blobfile, channel){
                    var message = this._createMessage('', channel,'file');
                    message.file = {
                        name : file.name,
                        size : file.size,
                        type : file.type
                    }
                    var sendId = '';
                    _.forEach(users, function (user) {
                        sendId = DataConnection.send(user.id, 'dataChat', message,sendId) || sendId;
                    }.bind(this));
                    var storeMessage = _.cloneDeep(message);
                    storeMessage.sendId = sendId;
                    storeMessage.file.blob = blobfile;
                    api.storeMessage(Broker.getPeerId(), storeMessage);
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
                    var message = this._createMessage(text, channel,'text');
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
                    this._db.transaction("rw", this._db.messages, function () {
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
                    }.bind(this));
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
                    this._db.transaction("rw", this._db.messages, function () {
                        this._db.messages.where('channel').equals(channel).modify({'status': 'read'}).then(function(){
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
                        });
                    }.bind(this));
                        this._db.messages.where('channel').equals(channel).sortBy("sendStamp",defer.resolve);
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
                    this._db.messages.where("status").equals('unread').sortBy("sendStamp",defer.resolve);
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
                _createMessage: function (text, channel,type) {
                    var date = new $window.Date();
                    var uuId = this._createUUID();
                    return {
                        id :uuId,
                        channel: channel,
                        type : type,
                        messageId:uuId,
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

