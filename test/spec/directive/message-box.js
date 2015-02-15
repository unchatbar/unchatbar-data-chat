describe('Directive: unDataChatMessageBox', function () {
    var build = function () {
    };

    beforeEach(module('test/mock/views/unchatbar-data-chat/message-box.html'));
    beforeEach(module('unchatbar-data-chat'));

    beforeEach(inject(function ($compile, $rootScope,$templateCache) {
        var template = $templateCache.get('test/mock/views/unchatbar-data-chat/message-box.html');
        $templateCache.put("views/unchatbar-data-chat/message-box.html",
            template
        );
        build = function () {
            var element = $compile("<un-data-chat-message-box channel=\"{{'channelA'}}\" " +
            "user-map=\"[{id:'userA',label: 'labelUserA'}]\"></un-data-chat-message-box>")($rootScope);
            $rootScope.$digest();
            return element;
        };
    }));
    xdescribe('check init', function () {
        it('it should be an empty object', function () {
            var element = build();

            expect(element.scope().channel).toBe('channelA');
        });
    });

    xdescribe('check html', function () {
        var element;
        beforeEach(function () {
            element = build();
            //spyOn(element.scope(),'getMessageListByChannel').and.returnValue([{from: 'userA',message: {text:'test'}}]);
            element.scope().messageList = [{from: 'userA',message: {text:'test'}}]
        });
        it('should contain label from first user', inject(function ($rootScope) {

            $rootScope.$digest();
            expect(element.html()).toContain("labelUserA");
        }));

        it('should contain label from second user', inject(function ($rootScope) {

            $rootScope.$digest();
            expect(element.html()).toContain("test");
        }));
    });

});