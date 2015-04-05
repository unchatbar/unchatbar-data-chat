describe('Directive: unDataChatMessageBox', function () {
    var build = function () {
    }, MessageService;

    beforeEach(module('test/mock/views/unchatbar-data-chat/message-box.html'));
    beforeEach(module('unchatbar-data-chat'));

    beforeEach(inject(function ($compile, $rootScope,$templateCache,Message) {
        MessageService = Message;
        var template = $templateCache.get('test/mock/views/unchatbar-data-chat/message-box.html');
        $templateCache.put("views/unchatbar-data-chat/message-box.html",
            template
        );
        build = function () {
            var element = $compile("<un-data-chat-message-box data-channel=\"{{'channelA'}}\" " +
            " data-user-map=\"{userA :{id:'userA',label: 'labelUserA'}}\"></un-data-chat-message-box>")($rootScope);
            $rootScope.$digest();

            return element;
        };
    }));
    describe('check init', function () {
        beforeEach(inject(function($q) {
            spyOn(MessageService, 'getMessageFromChannel').and.callFake(function () {
                var defer = $q.defer();
                defer.resolve([{from: 'userA', message: {text: 'test'}}]);
                return defer.promise;
            });
        }));
        describe('channel' , function() {
            it('should have the value from attribute `channel`', function () {
                var element = build();
                expect(element.isolateScope().channel).toBe('channelA');
            });
        });
        describe('userMap' , function(){
            it('should have the value from attribute `user-map`', function () {
                var element = build();
                expect(element.isolateScope().userMap).toEqual({userA :{id:'userA',label: 'labelUserA'}});
            });
        });
    });

    describe('check html', function () {
        var element;
        beforeEach(inject(function($q) {
            spyOn(MessageService, 'getMessageFromChannel').and.callFake(function () {
                var defer = $q.defer();
                defer.resolve([{from: 'userA',message: {text:'test'}}]);
                return defer.promise;
            });
            element = build();
        }));

        it('should contain label from first user', inject(function ($rootScope) {
            expect(element.html()).toContain("labelUserA");
        }));

        it('should contain label from second user', inject(function ($rootScope) {
            expect(element.html()).toContain("test");
        }));
    });

    describe('check events' , function(){
       describe('MessageUpdateUnreadMessage' , function(){
           it('should contain label from first user', inject(function ($q,$rootScope) {

               spyOn(MessageService, 'getMessageFromChannel').and.callFake(function () {
                   var defer = $q.defer();
                   defer.resolve([]);
                   return defer.promise;
               });
               var element = build();
               element.isolateScope().$broadcast('MessageUpdateUnreadMessage',{});

               expect(MessageService.getMessageFromChannel).toHaveBeenCalledWith('channelA');
           }));
       }) ;
    });

});