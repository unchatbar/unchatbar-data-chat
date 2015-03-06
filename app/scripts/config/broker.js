'use strict';
angular.module('unchatbar-data-chat')
    .config(['BrokerProvider','LOCALSTORAGE',
        function (  BrokerProvider, LOCALSTORAGE) {
            BrokerProvider.setHost('0.0.0.0');
            BrokerProvider.setPort(9000);
        }]);