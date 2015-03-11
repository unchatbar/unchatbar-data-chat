angular.module('unchatbar-data-chat').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/unchatbar-data-chat/message-box.html',
    "<div>\n" +
    "\n" +
    "    <div class=\"panel panel-primary\">\n" +
    "        <div class=\"panel-body\" scroll-glue>\n" +
    "            <ul class=\"chat\">\n" +
    "                <li class=\"left clearfix\" data-ng-repeat=\"message in messageList\">\n" +
    "                            <span class=\"chat-img pull-left\">\n" +
    "                            <img class=\"profile-image\" ng-src=\"{{userMap[message.from].image}}\" width=\"80\">\n" +
    "                        </span>\n" +
    "\n" +
    "                    <div class=\"chat-body clearfix\">\n" +
    "                        <div class=\"header\">\n" +
    "                            <strong class=\"primary-font\">{{userMap[message.from].label}}</strong>\n" +
    "                            <small class=\"pull-right text-muted\">\n" +
    "                                <span class=\"glyphicon glyphicon-time\"></span>\n" +
    "                                {{getFormateDate(message.message.meta.sendStamp) | date:'/dd/MM/yyyy @ H:mm' :'GMT'}}\n" +
    "                            </small>\n" +
    "\n" +
    "                        </div>\n" +
    "                        <p ng-bind-html=\"message.message.text | emoticons\"></p>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "        <div class=\"panel-footer\">\n" +
    "            <form>\n" +
    "                <div class=\"input-group\">\n" +
    "                <textarea enter-submit=\"sendTextMessage(userMap,channel);text='';\" id=\"btn-input\" cols=\"2\" type=\"text\" data-ng-model=\"text\" class=\"form-control input-sm\"\n" +
    "                          placeholder=\"Type your message here...\"></textarea>\n" +
    "                        <span class=\"input-group-btn\">\n" +
    "                            <button class=\"btn btn-warning btn-sm\" id=\"btn-chat\"\n" +
    "                                    data-ng-click=\"sendTextMessage(userMap,channel);text='';\">\n" +
    "                                Send\n" +
    "                            </button>\n" +
    "                        </span>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('views/unchatbar-data-chat/unread-message.html',
    "<div data-ng-init=\"showMessage=false\">\n" +
    "    <div class=\"notification-icon fa-2x\" data-ng-click=\"showMessage=!showMessage\">\n" +
    "        <span class=\"glyphicon glyphicon-envelope\"></span>\n" +
    "        <span class=\"badge\">{{unreadMessageList.length || 0}}</span>\n" +
    "    </div>\n" +
    "    <div class=\"panel panel-primary new-message-box\" data-ng-show=\"showMessage\">\n" +
    "        <div class=\"panel-body\" scroll-glue>\n" +
    "            <ul class=\"chat\" >\n" +
    "                <li class=\"left clearfix\" data-ng-show=\"unreadMessageList.length === 0\">\n" +
    "                    no new Messages\n" +
    "                </li>\n" +
    "                <li class=\"left clearfix\" data-ng-repeat=\"message in unreadMessageList\">\n" +
    "                            <span class=\"chat-img pull-left\">\n" +
    "                            <img class=\"profile-image\" ng-src=\"{{userMap[message.from].image}}\" width=\"80\">\n" +
    "                        </span>\n" +
    "\n" +
    "                    <div class=\"chat-body clearfix\">\n" +
    "                        <div class=\"header\">\n" +
    "                            <strong class=\"primary-font\">{{userMap[message.from].label}}</strong>\n" +
    "                            <small class=\"pull-right text-muted\">\n" +
    "                                <span class=\"glyphicon glyphicon-time\"></span>\n" +
    "                                {{getFormateDate(message.message.meta.sendStamp) | date:'/dd/MM/yyyy @ H:mm' :'GMT'}}\n" +
    "                            </small>\n" +
    "\n" +
    "                        </div>\n" +
    "                        <p>\n" +
    "                            {{message.message.text}}\n" +
    "                        </p>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );

}]);
