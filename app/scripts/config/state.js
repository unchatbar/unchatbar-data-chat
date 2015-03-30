'use strict';
angular.module('unchatbar-data-chat')
    .config(['$stateProvider', '$locationProvider',
        function ($stateProvider, $locationProvider) {
            $locationProvider.html5Mode(true);

            $stateProvider
                .state('channel', {
                    url: '/{channel}'
                });
        }
    ]);