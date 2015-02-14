'use strict';

describe('Serivce: phoneBook', function () {
    var BrokerService, rootScope, sessionStorage, log, DataConnectionService;
    beforeEach(module('unchatbar-data-chat'));


    beforeEach(inject(function ($rootScope, $log, $sessionStorage, $localStorage, Broker, DataConnection) {
        rootScope = $rootScope;
        log = $log;
        BrokerService = Broker;
        sessionStorage = $sessionStorage;
        DataConnectionService = DataConnection;
    }));

    describe('check methode', function () {


    });
});