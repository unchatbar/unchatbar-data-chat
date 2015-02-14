'use strict';

describe('Controller: phoneBook', function () {

    beforeEach(module('unchatbar-contact'));

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


    });


});
