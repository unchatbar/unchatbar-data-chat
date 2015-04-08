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
        transaction : function(){},
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
            toArray : function(){},
            each : function(){},
            sortBy : function(){}

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
                    messages: "&id,messageId,sendId,sendStamp,channel,status,from,meta,file"
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

                expect(MessageService._createMessage('testText', 'ChannelA','messageType')).toEqual({
                    id: 'message-uui-id',
                    channel: 'ChannelA',
                    messageId: 'message-uui-id',
                    sendStamp: mockWindowDate.getTime(),
                    type : 'messageType',
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

            it('should call `_createMessage` with channel and type `file`', function () {
                MessageService.send([{id: 'user'}], 'testText', 'channelA');

                expect(MessageService._createMessage).toHaveBeenCalledWith('testText', 'channelA', 'text');
            });

            it('should call `DataConnection.send` for all user with userId,`Message`,messageObject', function () {
                MessageService.send([{id: 'user'}], 'testText', 'channelA');

                expect(DataConnectionService.send).toHaveBeenCalledWith('user', 'dataChat', {text: 'message'},'');

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
                spyOn(MessageService._db,'transaction').and.callFake(function(mod,table,cb){
                    cb();
                });
                spyOn(MessageService._db.messages, 'add').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve();
                    return defer.promise;
                });
                spyOn(rootScope, '$broadcast').and.returnValue(true);
            }));
            it('should call transaction with `rw` and db.messages' , function(){
                MessageService.storeMessage('fromPeerId', {text: 'message', channel: 'channelA'});

                expect(MessageService._db.transaction).toHaveBeenCalledWith('rw',MessageService._db.messages,jasmine.any(Function));
            });
            describe('after callback transaction' , function() {
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
                            message: {
                                channel: 'channelA',
                                text: 'message',
                                from: 'fromPeerId'
                            },
                            from: 'fromPeerId'
                        }
                    });
                });
            });
        });

        describe('getMessageFromChannel', function () {
            var sortField,tranactionCallBack;
            beforeEach(function () {
                MessageService._db = mockDb;
                spyOn(MessageService._db,'transaction').and.callFake(function(mod,table,cb){
                    tranactionCallBack = cb;
                });
            });

            it('should call transaction with `rw` and db.messages' , function(){
                MessageService.getMessageFromChannel('channelA');

                expect(MessageService._db.transaction).toHaveBeenCalledWith('rw',MessageService._db.messages,jasmine.any(Function));
            });
            describe('after callback transaction' , function(){
                beforeEach(inject(function ($q) {

                    spyOn(MessageService._db.messages, 'where').and.callThrough();
                    spyOn(MessageService._db.messages, 'equals').and.callThrough();
                    spyOn(MessageService._db.messages, 'modify').and.callFake(function () {
                        var defer = $q.defer();
                        defer.resolve();
                        return defer.promise;
                    });
                    spyOn(rootScope, '$broadcast').and.returnValue(true);
                    MessageService.getMessageFromChannel('channelA');

                    tranactionCallBack();
                }));

                it('should call _db.messages.where with `channel` ', function () {
                    expect(MessageService._db.messages.where).toHaveBeenCalledWith('channel');
                });

                it('should call _db.messages.equals with argument `channel` ', function () {
                    expect(MessageService._db.messages.equals).toHaveBeenCalledWith('channelA');
                });

                it('should call _db.messages.equals with argument `sendId` ', function () {
                    expect(MessageService._db.messages.modify).toHaveBeenCalledWith({"status": 'read'});
                });

                it('should $broadcast `MessageUpdateReadMessage`', function () {
                    rootScope.$apply();

                    expect(rootScope.$broadcast).toHaveBeenCalledWith('MessageUpdateReadMessage',{});
                });
            });
            describe('get list query' , function(){
                beforeEach(inject(function ($q) {
                    spyOn(MessageService._db.messages, 'where').and.callThrough();
                    spyOn(MessageService._db.messages, 'equals').and.callThrough();
                    spyOn(MessageService._db.messages, 'sortBy').and.callFake(function (sort,promise) {
                        sortField = sort;
                        promise.call(this,['messageList']);
                    });
                }));
                it('should call _db.messages.where with `channel` ', function () {
                    MessageService.getMessageFromChannel('channelA');

                    expect(MessageService._db.messages.where).toHaveBeenCalledWith('channel');
                });

                it('should call _db.messages.equals with argument `channel` ', function () {
                    MessageService.getMessageFromChannel('channelA');

                    expect(MessageService._db.messages.equals).toHaveBeenCalledWith('channelA');
                });

                it('should call sortBy with `sendStamp`', function () {
                    MessageService.getMessageFromChannel('channelA');

                    rootScope.$apply();

                    expect(sortField).toBe('sendStamp');
                });

                it('should call _db.messages.sortBy', function () {
                    MessageService.getMessageFromChannel('channelA');

                    rootScope.$apply();

                    expect(MessageService._db.messages.sortBy).toHaveBeenCalled();
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








        });

        describe('getUnreadMessageMap', function () {
            var sortField;
            beforeEach(inject(function ($q) {
                MessageService._db = mockDb;
                spyOn(MessageService._db,'transaction').and.callFake(function(mod,table,cb){
                    cb();
                });
                spyOn(MessageService._db.messages, 'where').and.callThrough();
                spyOn(MessageService._db.messages, 'equals').and.callThrough();
                spyOn(MessageService._db.messages, 'sortBy').and.callFake(function (sort,promise) {
                    sortField = sort;
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
            it('should call _db.messages.sortBy', function () {
                MessageService.getUnreadMessageMap();

                rootScope.$apply();

                expect(MessageService._db.messages.sortBy).toHaveBeenCalled();
            });

            it('should call sortBy with `sendStamp`', function () {
                MessageService.getUnreadMessageMap();

                rootScope.$apply();

                expect(sortField).toBe('sendStamp');
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

        describe('sendFile', function () {
            var messageObject = {}, mockWindowDate,uploadFile;
            beforeEach(function () {
                uploadFile = {
                    name : 'test',
                    size :12,
                    type : 'image'
                }
                spyOn(DataConnectionService, 'send').and.returnValue('messageId');
                spyOn(MessageService, 'storeMessage').and.returnValue(true);
                spyOn(MessageService, '_createMessage').and.returnValue({message: 'id'});
                spyOn(BrokerService, 'getPeerId').and.returnValue('ownPeerId');
                MessageService.sendFile([{id: 'user'}],uploadFile,'blob' , 'channelA');
            });

            it('should call `_createMessage` with channel and type `file`', function () {
                expect(MessageService._createMessage).toHaveBeenCalledWith('', 'channelA', 'file');
            });

            it('should call `DataConnection.send` with userid , `dataChat` message and empty sendID', function () {
                expect(DataConnectionService.send).toHaveBeenCalledWith('user', 'dataChat',{
                    message: 'id',
                    file : {
                        name : 'test',
                        size :12,
                        type : 'image'
                    }
                }, '');
            });

            it('should call `storeMessage` with peerId and message', function () {
                expect(MessageService.storeMessage).toHaveBeenCalledWith('ownPeerId', {
                        message: 'id',
                        sendId: 'messageId',
                        file: {
                            name: 'test',
                            size: 12,
                            type: 'image',
                            blob : 'blob'
                        }
                    }
                );
            });


        });

        describe('storeFileBlob' , function(){
            var myMockMessage = {file : {}};
            beforeEach(inject(function ($q) {
                MessageService._db = mockDb;
                spyOn(MessageService._db,'transaction').and.callFake(function(mod,table,cb){
                    cb();
                });
                spyOn(MessageService._db.messages, 'where').and.callThrough();
                spyOn(MessageService._db.messages, 'equals').and.callThrough();
                spyOn(rootScope, '$broadcast').and.returnValue(true);
                spyOn(MessageService._db.messages, 'modify').and.callFake(function (cb) {
                    cb(myMockMessage);
                    var defer = $q.defer();
                    defer.resolve();
                    return defer.promise;
                });
            }));
            it('should call transaction with `rw` and db.messages' , function(){
                MessageService.storeFileBlob('messageId','blob');

                expect(MessageService._db.transaction).toHaveBeenCalledWith('rw',MessageService._db.messages,jasmine.any(Function));
            });
            describe('after callback transaction' , function(){
                it('should call _db.messages.where with `messageId` ', function () {
                    MessageService.storeFileBlob('messageId','blob');

                    expect(MessageService._db.messages.where).toHaveBeenCalledWith('messageId');
                });

                it('should call _db.messages.equals with argument `messageId` ', function () {
                    MessageService.storeFileBlob('myMessageId','blob');

                    expect(MessageService._db.messages.equals).toHaveBeenCalledWith('myMessageId');
                });

                it('should update message.file.blob ', function () {
                    MessageService.storeFileBlob('myMessageId','blob');

                    expect(myMockMessage).toEqual({file : {blob:'blob'}});
                });

                it('should broadcast `MessageUpdateFile` after update ', function () {
                    MessageService.storeFileBlob('myMessageId','blob');
                    rootScope.$apply();

                    expect(rootScope.$broadcast).toHaveBeenCalledWith('MessageUpdateFile',{});
                });

            });
        });

        describe('sendBlobFromMessage' , function(){
            var myMockMessage;
            beforeEach(function(){
                myMockMessage = {
                    file : {
                        blob : 'testBlob'
                    }
                }
                MessageService._db = mockDb;
                spyOn(MessageService._db.messages, 'where').and.callThrough();
                spyOn(MessageService._db.messages, 'equals').and.callThrough();
                spyOn(MessageService._db.messages, 'each').and.callFake(function(cb){
                    cb(myMockMessage);
                });
                spyOn(DataConnectionService, 'send').and.returnValue(true);
            });
            it('should call _db.messages.where with `messageId` ', function () {
                MessageService.sendBlobFromMessage('clientId','messageId');

                expect(MessageService._db.messages.where).toHaveBeenCalledWith('messageId');
            });

            it('should call _db.messages.equals with argument `messageId` ', function () {
                MessageService.sendBlobFromMessage('clientId','myMessageId');

                expect(MessageService._db.messages.equals).toHaveBeenCalledWith('myMessageId');
            });

            it('should call _db.messages.equals with argument `messageId` ', function () {
                MessageService.sendBlobFromMessage('clientId','myMessageId');

                expect(DataConnectionService.send).toHaveBeenCalledWith('clientId','sendFileBlob',{
                    messageId : 'myMessageId',
                    blob : 'testBlob'
                });
            });
        });

        describe('getFileFromClient' , function(){
            var mockMessage = {
                file : {}
            }
            beforeEach(inject(function($q) {
                MessageService._db = mockDb;
                spyOn(MessageService._db.messages, 'where').and.callThrough();
                spyOn(MessageService._db.messages, 'equals').and.callThrough();
                spyOn(DataConnectionService, 'send').and.returnValue(true);
                spyOn(MessageService._db.messages, 'modify').and.callFake(function (cb) {
                    cb(mockMessage);
                    var defer = $q.defer();
                    defer.resolve();
                    return defer.promise;
                });
                spyOn(rootScope, '$broadcast').and.returnValue(true);
            }));

            it('should call _db.messages.where with `messageId` ', function () {
                MessageService.getFileFromClient('receiver','messageId');

                expect(MessageService._db.messages.where).toHaveBeenCalledWith('messageId');
            });

            it('should call _db.messages.equals with argument `messageId` ', function () {
                MessageService.getFileFromClient('receiver','myMessageId');

                expect(MessageService._db.messages.equals).toHaveBeenCalledWith('myMessageId');
            });

            it('should change message.file.sendGetFile to true', function () {
                MessageService.getFileFromClient('receiver','myMessageId');

                expect(mockMessage).toEqual({file : {sendGetFile:true}});
            });

            describe('after update message' , function(){
                beforeEach(function(){
                    MessageService.getFileFromClient('receiver','myMessageId');
                    rootScope.$apply();
                });
                it('should broadcast `MessageUpdateFile`' , function(){
                    expect(rootScope.$broadcast).toHaveBeenCalledWith('MessageUpdateFile', {});
                });

                it('should send messageId to client' , function(){
                    expect(DataConnectionService.send).toHaveBeenCalledWith('receiver','getFile', {messageId:'myMessageId'});
                });
            });


        });
    });
});