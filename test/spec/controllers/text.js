'use strict';

describe('Controller: phoneBook', function () {

    beforeEach(module('unchatbar-contact'));

    var textCTRL, scope, PhoneBookService,MessageService;

    beforeEach(inject(function ($controller, $rootScope, Message, PhoneBook) {
        PhoneBookService = PhoneBook;
        MessageService = Message;
        scope = $rootScope.$new();

        textCTRL = function () {
            $controller('unDataChatText', {
                $scope: scope,
                $stateParams: stateParams,
                $state : state,
                PhoneBook: PhoneBookService

            });
        };
    }));

    describe('check methode', function () {


    });


});
