'use strict';

describe('Controller: phoneBook', function () {

    beforeEach(module('unchatbar-data-chat'));

    var textCTRL, scope, MessageService;

    beforeEach(inject(function ($controller, $rootScope, Message) {
        MessageService = Message;
        scope = $rootScope.$new();

        textCTRL = function () {
            $controller('unDataChatText', {
                $scope: scope,
                Message: MessageService

            });
        };
    }));

    describe('check methode', function () {
        beforeEach(function(){
            textCTRL();
        });
        describe('sendTextMessage', function () {
            it('should call `Message.send` with user,text channel',function(){
               spyOn(MessageService,'send').and.returnValue(true);
               scope.text = 'testText';

               scope.sendTextMessage(['user'],'channelA');

               expect(MessageService.send).toHaveBeenCalledWith(['user'],'testText','channelA');
            });
        });
        describe('sendTextMessage', function () {
            beforeEach(inject(function($q){
                spyOn(MessageService,'getMessageFromChannel').and.callFake(function(){
                   var defer = $q.defer();
                    defer.resolve(['messageList']);
                    return defer.promise;
                });
            }));
            it('should call `Message.getMessageFromChannel` with channel',function(){
                scope.getMessageListByChannel('channelA');

                scope.$apply();

                expect(MessageService.getMessageFromChannel).toHaveBeenCalledWith('channelA');
            });

            it('should set `$scope.messageList ` to return value from `Message.getMessageFromChannel`',function(){
                scope.getMessageListByChannel('channelA');

                scope.$apply();

                expect(scope.messageList).toEqual(['messageList']);
            });
        });

        describe('sendTextMessage', function () {
            beforeEach(inject(function($q) {
                spyOn(MessageService, 'getUnreadMessageMap').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve(['messageList']);
                    return defer.promise;
                });
            }));
            it('should call `Message.getUnreadMessageMap` with channel',function(){
                scope.getUnreadMessageList();

                scope.$apply();

                expect(MessageService.getUnreadMessageMap).toHaveBeenCalled();
            });

            it('should set `$scope.unreadMessageList ` to return value from `Message.getUnreadMessageList`',function(){
                scope.getUnreadMessageList();

                scope.$apply();

                expect(scope.unreadMessageList).toEqual(['messageList']);
            });
        });



    });


});
