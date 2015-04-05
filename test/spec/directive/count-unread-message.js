describe('Directive: unDataChatMessageBox', function () {
    var build = function () {
    }, MessageService;

    beforeEach(module('test/mock/views/unchatbar-data-chat/count-unread-message.html'));
    beforeEach(module('unchatbar-data-chat'));

    beforeEach(inject(function ($compile, $rootScope,$templateCache,Message) {
        MessageService = Message;
        var template = $templateCache.get('test/mock/views/unchatbar-data-chat/count-unread-message.html');
        $templateCache.put("views/unchatbar-data-chat/count-unread-message.html",
            template
        );
        build = function () {
            var element = $compile("<un-data-chat-count-unread-message></un-data-chat-count-unread-message>")($rootScope);
            $rootScope.$digest();

            return element;
        };
    }));

    describe('check html', function () {
        var element;
        beforeEach(inject(function($q) {
            spyOn(MessageService, 'getUnreadMessageMap').and.callFake(function () {
                var defer = $q.defer();
                defer.resolve([
                    {from: 'userA',message: {text:'test'}},
                    {from: 'userA',message: {text:'test'}}
                ]);
                return defer.promise;
            });
            element = build();
        }));
        it('should contain size of unread message', inject(function ($rootScope) {
            expect(element.html()).toContain("2 items");
        }));

    });

});