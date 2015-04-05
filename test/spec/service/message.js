'use strict';

describe('Serivce: phoneBook', function () {
    var BrokerService, rootScope, windowService, MessageService, DataConnectionService;
    beforeEach(module('unchatbar-data-chat'));


    beforeEach(inject(function ($rootScope, $window, Broker, Message, DataConnection) {
        rootScope = $rootScope;
        BrokerService = Broker;
        MessageService = Message;
        windowService = $window;
        DataConnectionService = DataConnection;
    }));

    var mockDb = {
        messages: {
            where: function () {
                return this;
            },
            equals: function () {
                return this;
            },
            modify: function () {
            },
            add: function () {
            },
            toArray : function(){}

        }
    };

    describe('check methode', function () {
        describe('initStorage', function () {
            var storageMock;
            beforeEach(function () {
                storageMock = {
                    version: function () {
                        return this;
                    },
                    stores: function () {
                    },
                    open: function () {
                    }
                }
                spyOn(window, 'Dexie').and.returnValue(storageMock);

            });
            it('should create Dexie object with `unTextChat`', function () {
                MessageService.initStorage();

                expect(window.Dexie).toHaveBeenCalledWith('unTextChat');
            });
            it('should call Dexie.version width DBVERSION', function () {
                spyOn(storageMock, 'version').and.callThrough();
                MessageService.DBVERSION = 2;
                MessageService.initStorage();

                expect(storageMock.version).toHaveBeenCalledWith(2);
            });

            it('should call Dexie.stores table message', function () {
                spyOn(storageMock, 'stores').and.callThrough();

                MessageService.initStorage();

                expect(storageMock.stores).toHaveBeenCalledWith({
                    messages: "&messageId,sendId,sendStamp,channel,status,from,meta"
                });
            });

            it('should call Dexie.open', function () {
                spyOn(storageMock, 'open').and.callThrough();
                MessageService.initStorage();

                expect(storageMock.open).toHaveBeenCalled();
            });
        });

        describe('_createMessage', function () {

            it('should set message', function () {
                var oldDate = Date, mockWindowDate;
                spyOn(MessageService, '_createUUID').and.returnValue('message-uui-id');
                spyOn(windowService, 'Date').and.callFake(function () {
                    mockWindowDate = new oldDate();

                    return mockWindowDate;
                });

                expect(MessageService._createMessage('testText', 'ChannelA')).toEqual({
                    channel: 'ChannelA',
                    messageId: 'message-uui-id',
                    sendStamp: mockWindowDate.getTime(),
                    meta: {
                        date: mockWindowDate,
                        text: 'testText'
                    },
                    sendId: '',
                    status: 'unread',
                    clientRead: false
                });
            });
        });

        describe('send', function () {
            var messageObject = {}, mockWindowDate;
            beforeEach(function () {
                spyOn(DataConnectionService, 'send').and.returnValue('messageId');
                spyOn(MessageService, 'storeMessage').and.returnValue(true);
                spyOn(MessageService, '_createMessage').and.returnValue({text: 'message'});
                spyOn(BrokerService, 'getPeerId').and.returnValue('ownPeerId');
            });
            it('should call `DataConnection.send` for all user with userId,`Message`,messageObject', function () {
                MessageService.send([{id: 'user'}], 'testText', 'channelA');

                expect(DataConnectionService.send).toHaveBeenCalledWith('user', '', 'dataChat', {text: 'message'});

            });

            it('should call `DataConnection.send` for all user with userId,`Message`,messageObject', function () {
                MessageService.send([{id: 'user'}], 'testText', 'channelA');

                expect(MessageService.storeMessage).toHaveBeenCalledWith(
                    'ownPeerId', {text: 'message', sendId: 'messageId'});
            });

        });

        describe('clientReadMessage', function () {

            beforeEach(inject(function ($q) {
                MessageService._db = mockDb;
                spyOn(MessageService._db.messages, 'where').and.callThrough();
                spyOn(MessageService._db.messages, 'equals').and.callThrough();
                spyOn(MessageService._db.messages, 'modify').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve();
                    return defer.promise;
                });
                spyOn(rootScope, '$broadcast').and.returnValue(true);
            }));
            it('should call _db.messages.where with `sendID` ', function () {
                MessageService.clientReadMessage('sendMessageIdFromBroker');

                expect(MessageService._db.messages.where).toHaveBeenCalledWith('sendId');
            });

            it('should call _db.messages.equals with argument `sendId` ', function () {
                MessageService.clientReadMessage('sendMessageIdFromBroker');

                expect(MessageService._db.messages.equals).toHaveBeenCalledWith('sendMessageIdFromBroker');
            });

            it('should call _db.messages.equals with argument `sendId` ', function () {
                MessageService.clientReadMessage('sendMessageIdFromBroker');

                expect(MessageService._db.messages.modify).toHaveBeenCalledWith({"clientRead": true});
            });

            it('should broadcast `MessageUpdateClientRead`', function () {
                MessageService.clientReadMessage('sendMessageIdFromBroker');

                rootScope.$apply();

                expect(rootScope.$broadcast).toHaveBeenCalledWith('MessageUpdateClientRead', {});
            });
        });

        describe('storeMessage', function () {
            var oldDate = Date, mockWindowDate = 'date';
            beforeEach(inject(function ($q) {
                MessageService._db = mockDb;
                spyOn(MessageService._db.messages, 'add').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve();
                    return defer.promise;
                });
                spyOn(rootScope, '$broadcast').and.returnValue(true);
            }));

            it('should add message to `messages` table', function () {
                MessageService.storeMessage('fromPeerId', {text: 'message', channel: 'channelA'});

                expect(MessageService._db.messages.add).toHaveBeenCalledWith(
                    {
                        channel: 'channelA',
                        text: 'message',
                        from: 'fromPeerId'
                    }
                );
            });

            it('should pu$broadcast `MessageUpdateUnreadMessage` width message ', function () {
                MessageService.storeMessage('fromPeerId', {text: 'message', channel: 'channelA'});

                rootScope.$apply();

                expect(rootScope.$broadcast).toHaveBeenCalledWith('MessageUpdateUnreadMessage', {
                    unread: {
                        channel: 'channelA',
                        message:  {
                            channel: 'channelA',
                            text: 'message',
                            from: 'fromPeerId'
                        },
                        from: 'fromPeerId'
                    }
                });
            });
        });

        describe('getMessageFromChannel', function () {
            beforeEach(inject(function ($q) {
                MessageService._db = mockDb;
                spyOn(MessageService._db.messages, 'where').and.callThrough();
                spyOn(MessageService._db.messages, 'equals').and.callThrough();
                spyOn(MessageService._db.messages, 'modify').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve();
                    return defer.promise;
                });
                spyOn(MessageService._db.messages, 'toArray').and.callFake(function (promise) {
                    promise.call(this,['messageList']);
                });
                spyOn(rootScope, '$broadcast').and.returnValue(true);
            }));
            it('should call _db.messages.where with `channel` ', function () {
                MessageService.getMessageFromChannel('channelA');

                expect(MessageService._db.messages.where).toHaveBeenCalledWith('channel');
            });

            it('should call _db.messages.equals with argument `channel` ', function () {
                MessageService.getMessageFromChannel('channelA');

                expect(MessageService._db.messages.equals).toHaveBeenCalledWith('channelA');
            });

            it('should call _db.messages.equals with argument `sendId` ', function () {
                MessageService.getMessageFromChannel('channelA');

                expect(MessageService._db.messages.modify).toHaveBeenCalledWith({"status": 'read'});
            });

            it('should $broadcast `MessageUpdateReadMessage`', function () {
                MessageService.getMessageFromChannel('channelA');

                rootScope.$apply();

                expect(rootScope.$broadcast).toHaveBeenCalledWith('MessageUpdateReadMessage',{});
            });

            it('should call _db.messages.toArray', function () {
                MessageService.getMessageFromChannel('channelA');

                rootScope.$apply();

                expect(MessageService._db.messages.toArray).toHaveBeenCalled();
            });

            it('should return a messagelist', function () {
                var messages;
                MessageService.getMessageFromChannel('channelA').then(function(list){
                    messages = list;
                });
                rootScope.$apply();

                expect(messages).toEqual(['messageList']);
            });

        });

        describe('getUnreadMessageMap', function () {
            beforeEach(inject(function ($q) {
                MessageService._db = mockDb;
                spyOn(MessageService._db.messages, 'where').and.callThrough();
                spyOn(MessageService._db.messages, 'equals').and.callThrough();
                spyOn(MessageService._db.messages, 'toArray').and.callFake(function (promise) {
                    promise.call(this,['messageList']);
                });
            }));
            it('should call _db.messages.where with `status` ', function () {
                MessageService.getUnreadMessageMap();

                expect(MessageService._db.messages.where).toHaveBeenCalledWith('status');
            });

            it('should call _db.messages.equals with `unread` ', function () {
                MessageService.getUnreadMessageMap();

                expect(MessageService._db.messages.equals).toHaveBeenCalledWith('unread');
            });
            it('should call _db.messages.toArray', function () {
                MessageService.getUnreadMessageMap();

                rootScope.$apply();

                expect(MessageService._db.messages.toArray).toHaveBeenCalled();
            });

            it('should return a messagelist', function () {
                var messages;
                MessageService.getUnreadMessageMap().then(function(list){
                    messages = list;
                });
                rootScope.$apply();

                expect(messages).toEqual(['messageList']);
            });
        });

    });
});