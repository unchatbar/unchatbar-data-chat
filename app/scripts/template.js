angular.module('unchatbar-data-chat').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/unchatbar-data-chat/message-box.html',
    "<div>\n" +
    "    <div data-ng-repeat=\"message in messageList\" style=\"border:1px solid red\">\n" +
    "        From:{{userMap[message.from].label}} <br>\n" +
    "        Message:{{message.message.text}}\n" +
    "    </div>\n" +
    "    <textarea data-ng-model=\"text\"></textarea>\n" +
    "    <button type=\"submit\" class=\"btn btn-default\" ng-click=\"sendTextMessage(userMap,channel);text='';\">send</button>\n" +
    "</div>"
  );


  $templateCache.put('views/unchatbar-data-chat/unread-message.html',
    "<div>\n" +
    "    <b>unread Message ({{unreadMessageList.length || 0}})</b>\n" +
    "    <div data-ng-repeat=\"message in unreadMessageList\">\n" +
    "        From:{{userMap[message.from].label}} <br>\n" +
    "        Message:{{message.message.text}}\n" +
    "    </div>\n" +
    "</div>"
  );

}]);
