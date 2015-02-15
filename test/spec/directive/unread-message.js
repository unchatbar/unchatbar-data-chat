describe('Directive: unDataChatMessageBox', function () {
    var build = function () {
    }, MessageService;

    beforeEach(module('test/mock/views/unchatbar-data-chat/unread-message.html'));
    beforeEach(module('unchatbar-data-chat'));

    beforeEach(inject(function ($compile, $rootScope,$templateCache,Message) {
        MessageService = Message;
        var template = $templateCache.get('test/mock/views/unchatbar-data-chat/unread-message.html');
        $templateCache.put("views/unchatbar-data-chat/unread-message.html",
            template
        );
        build = function () {
            var element = $compile("<un-data-chat-unread-message " +
            "user-map=\"{userA :{id:'userA',label: 'labelUserA'}}\"></un-data-chat-unread-message>")($rootScope);
            $rootScope.$digest();

            return element;
        };
    }));
    describe('check init', function () {
        describe('userMap' , function(){
            it('should have the value from attribute `user-map`', function () {
                var element = build();
                expect(element.isolateScope().userMap).toEqual({userA :{id:'userA',label: 'labelUserA'}});
            });
        });

    });

    describe('check html', function () {
        var element;
        beforeEach(function () {
            spyOn(MessageService,'getUnreadMessageMap').and.returnValue([{from: 'userA',message: {text:'test'}}]);
            element = build();
        });

        it('should contain label from first user', inject(function ($rootScope) {
            expect(element.html()).toContain("labelUserA");
        }));

        it('should contain label from second user', inject(function ($rootScope) {
            expect(element.html()).toContain("test");
        }));
    });

    describe('check events' , function(){
        describe('MessageUpdateUnreadMessage' , function(){
            it('should contain label from first user', inject(function ($rootScope) {
                var element = build();
                spyOn(MessageService,'getUnreadMessageMap').and.returnValue([]);
                element.isolateScope().$broadcast('MessageUpdateUnreadMessage',{});

                expect(MessageService.getUnreadMessageMap).toHaveBeenCalled();
            }));
        }) ;

        describe('MessageUpdateReadMessage' , function(){
            it('should contain label from first user', inject(function ($rootScope) {
                var element = build();
                spyOn(MessageService,'getUnreadMessageMap').and.returnValue([]);
                element.isolateScope().$broadcast('MessageUpdateReadMessage',{});

                expect(MessageService.getUnreadMessageMap).toHaveBeenCalled();
            }));
        }) ;
    });

});