'use strict';
angular.module('unchatbar-data-chat')
    .config(['BrokerProvider','LOCALSTORAGE',
        function (  BrokerProvider, LOCALSTORAGE) {
            BrokerProvider.setHost('unchatbar-server.herokuapp.com');
        }]);