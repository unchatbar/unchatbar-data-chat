'use strict';

describe('Serivce: phoneBook', function () {
    var BrokerService, rootScope, windowService, sessionStorage, MessageService, DataConnectionService;
    beforeEach(module('unchatbar-data-chat'));


    beforeEach(inject(function ($rootScope, $window, $sessionStorage, $localStorage, Broker, Message, DataConnection) {
        rootScope = $rootScope;
        BrokerService = Broker;
        sessionStorage = $sessionStorage;
        MessageService = Message;
        windowService = $window;
        DataConnectionService = DataConnection;
    }));

    describe('check methode', function () {
        describe('initStorage', function () {
            beforeEach(function () {
                spyOn(sessionStorage, '$default').and.returnValue({textMessage: {test: 'data'}});
                MessageService.initStorage();
            });
            it('should call `$sessionStorage.$default` with object', function () {
                expect(sessionStorage.$default).toHaveBeenCalledWith({
                    textMessage: {
                        unread: [],
                        read: {}
                    }
                });
            });
            it('should set  `MessageTextService._storage` return value from `$sessionStorage.$default`', function () {
                expect(MessageService._message).toEqual({test: 'data'});
            });
        });
        describe('send', function () {
            var messageObject = {}, mockWindowDate;
            beforeEach(function () {
                spyOn(DataConnectionService, 'send').and.returnValue(true);
                spyOn(MessageService, 'storeMessage').and.returnValue(true);
                spyOn(BrokerService, 'getPeerId').and.returnValue('ownPeerId');
                spyOn(MessageService, '_createUUID').and.returnValue('message-uui-id');
                var oldDate = Date;
                spyOn(windowService, 'Date').and.callFake(function () {
                    mockWindowDate = new oldDate();

                    return mockWindowDate;
                });
                MessageService.send([{id: 'user'}], 'testText', 'channelA');
                messageObject = {
                    channel: 'channelA',
                    text: 'testText',
                    id: 'message-uui-id',
                    meta: {
                        date: mockWindowDate
                    }
                }
            });
            it('should call `DataConnection.send` for all user with userId,`Message`,messageObject', function () {
                expect(DataConnectionService.send).toHaveBeenCalledWith('user', '', 'dataChat', messageObject);
            });

            it('should call `DataConnection.send` for all user with userId,`Message`,messageObject', function () {
                expect(MessageService.storeMessage).toHaveBeenCalledWith('ownPeerId', messageObject);
            });
        });
        describe('storeMessage', function () {
            var oldDate = Date,mockWindowDate = 'date';
            beforeEach(function(){
                oldDate = Date;
                spyOn(windowService, 'Date').and.callFake(function () {
                    mockWindowDate = new oldDate();

                    return mockWindowDate;
                });
            });
            it('should push message to `Message._message.unread`', function () {
                MessageService.storeMessage('fromPeerId', {meta: {date:mockWindowDate},channel: 'channelA',id:'testId', text: 'message'});

                expect(MessageService._message.unread).toEqual([
                    {
                        channel: 'channelA',
                        id:'testId',
                        sendStamp: mockWindowDate.getTime(),
                        message: {
                            channel: 'channelA',
                            text: 'message',
                            id:'testId',
                            meta : {
                                date: 'date'
                            }
                        },

                        from: 'fromPeerId'
                    }
                ]);
            });

            it('should not push message to `Message._message.unread`, when message.id exists in unread', function () {
                MessageService._message.unread = [
                    {
                        channel: 'channelA',
                        id:'testId',
                        message: {
                            channel: 'channelA', text: 'message'
                        },
                        from: 'fromPeerId'
                    }
                ];

                MessageService.storeMessage('fromPeerId', {channel: 'channelA',id:'testId', text: 'message'});

                expect(MessageService._message.unread).toEqual([
                    {
                        channel: 'channelA',
                        id:'testId',
                        message: {
                            channel: 'channelA', text: 'message'
                        },
                        from: 'fromPeerId'
                    }
                ]);
            });

            it('should broadcast `MessageUpdateUnreadMessage` with  `Message._message.unread`', function () {
                spyOn(rootScope, '$broadcast').and.returnValue(true);
                MessageService.storeMessage('fromPeerId', {meta: {date:mockWindowDate},channel: 'channelA', text: 'message'});
                expect(rootScope.$broadcast).toHaveBeenCalledWith('MessageUpdateUnreadMessage',
                    {
                        unread: {
                            channel: 'channelA',
                            message: {
                                meta : {
                                    date: jasmine.any(Object)
                                },
                                channel: 'channelA',
                                text: 'message'
                            },
                            from: 'fromPeerId'
                        }
                    }
                );
            });

        });

        describe('getMessageFromChannel', function () {
            beforeEach(function () {
                spyOn(rootScope, '$broadcast').and.returnValue(true);
            });
            it('should return an empty array, when `Message._message.read` is empty', function () {
                expect(MessageService.getMessageFromChannel('channelA')).toEqual([]);
            });

            it('should return `Message._message.read`', function () {
                MessageService._message.read['channelA'] = ['data'];
                expect(MessageService.getMessageFromChannel('channelA')).toEqual(['data']);
            });

            it('should not broadcast `MessageUpdateReadMessage`', function () {
                expect(rootScope.$broadcast).not.toHaveBeenCalled();
            });
            describe('`Message._message.unread` to `Message._message.unread`', function () {
                beforeEach(function () {
                    MessageService._message.read['channelA'] = ['readData'];
                    MessageService._message.unread = [
                        {channel: 'channelB', data: 'testA'},
                        {channel: 'channelA', data: 'testB'},
                        {channel: 'channelB', data: 'testC'}
                    ];
                });
                it('should remove channel from `Message._message.unread` ', function () {
                    MessageService.getMessageFromChannel('channelA');
                    expect(MessageService._message.unread).toEqual([
                        {channel: 'channelB', data: 'testA'},
                        {channel: 'channelB', data: 'testC'}]);
                });

                it('should return merge data from `Message._message.unread` and `Message._message.unread` ', function () {
                    expect(MessageService.getMessageFromChannel('channelA')).toEqual(['readData',
                        {channel: 'channelA', data: 'testB'}]);
                });

                it('should broadcast `MessageUpdateReadMessage`', function () {
                    MessageService.getMessageFromChannel('channelA');

                    expect(rootScope.$broadcast).toHaveBeenCalledWith('MessageUpdateReadMessage', {});
                });
            });
        });

        describe('getUnreadMessageMap', function () {
            it('should return `this._message.unread` ', function () {
                MessageService._message.unread = ['unreadData'];

                expect(MessageService.getUnreadMessageMap()).toEqual(['unreadData']);

            });
        });

    });
});