angular.module('unchatbar-data-chat').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/unchatbar-data-chat/count-unread-message.html',
    "<div class=\"un-count-unread-message\">{{unreadMessageList.length || 0}}</div>"
  );


  $templateCache.put('views/unchatbar-data-chat/message-box.html',
    "<div class=\"limit-loader\" data-ng-click=\"limit=limit+10\" title=\"{{'load more from history' | translate}}\">\n" +
    "    <i></i>\n" +
    "</div>\n" +
    "\n" +
    "<ul class=\"data-chat-list\" data-ng-init=\"limit=5\">\n" +
    "    <li class=\"mar-btm\" data-ng-repeat=\"message in messageList | limitTo:(limit*-1)\">\n" +
    "        <div data-ng-class=\"{'media-left' : ownPeerId === message.from,'media-right' : ownPeerId !== message.from}\">\n" +
    "            <img class=\"img-circle img-sm\" ng-src=\"{{userMap[message.from].image}}\" width=\"80\">\n" +
    "        </div>\n" +
    "        <div class=\"data-message-body pad-hor\" data-ng-class=\"{'speech-right' : ownPeerId !== message.from}\">\n" +
    "            <div class=\"speech\">\n" +
    "                <a href=\"#\" class=\"media-heading\">{{userMap[message.from].label}}</a>\n" +
    "\n" +
    "                <p data-ng-if=\"message.type === 'text'\">\n" +
    "                    <ng-emoticons emoticons-template-url=\"views/unchatbar-data-chat/message.html\"\n" +
    "                                  emoticons-data=\"message.meta.text\" emoticons-options=\"options\"/>\n" +
    "                </p>\n" +
    "                <div class=\"un-file-message\" data-ng-if=\"message.type === 'file'\">\n" +
    "                    <a data-ng-href=\"{{blobUrl}}\" download=\"{{file.name}}\"\n" +
    "                       data-ng-if=\"message.file.type.substring(0, 5) === 'image'\">\n" +
    "                        <img class=\"un-file-preview\" data-ng-src=\"{{blobUrl}}\" un-get-blob-url data-un-url=\"message.file.blob\"\n" +
    "                             blob-url=\"blobUrl\">\n" +
    "                    </a>\n" +
    "                    <a class=\"un-file-store\" data-ng-href=\"{{blobUrl}}\" download=\"{{file.name}}\"\n" +
    "                       data-ng-if=\"message.file.blob && message.file.type.substring(0, 5) !== 'image'\">\n" +
    "                        <i un-get-blob-url data-un-url=\"message.file.blob\" blob-url=\"blobUrl\"></i>\n" +
    "                    </a>\n" +
    "                    <a class=\"un-file-download\"  href=\"#\" data-ng-show=\"!message.file.blob && !message.file.sendGetFile\">\n" +
    "                            <i  data-ng-click=\"getFileFromClient(message.from,message.id)\"></i>\n" +
    "                    </a>\n" +
    "                    <div class=\"un-file-wait-for-download\" data-ng-show=\"!message.file.blob && message.file.sendGetFile\">\n" +
    "                        <i class=\"\"></i>\n" +
    "                    </div>\n" +
    "                    <div class=\"un-file-info\">\n" +
    "                        {{message.file.name}}({{(message.file.size/1048576).toFixed(2)}} MB)\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <p class=\"speech-time\">\n" +
    "                    <i class=\"fa fa-clock-o fa-fw\"></i> {{getFormateDate(message.meta.date) |\n" +
    "                    date:'dd/MM/yyyy @ H:mm' :'GMT'}}\n" +
    "                </p>\n" +
    "\n" +
    "                <div data-ng-class=\"{'message-read' :message.clientRead }\">\n" +
    "                    <i></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </li>\n" +
    "</ul>\n"
  );


  $templateCache.put('views/unchatbar-data-chat/message.html',
    "\n" +
    "<!---- Video Embedding code (Youtube and vimeo)------------>\n" +
    "<div ng-bind-html=\"neText\" ><div class=\"ne-code\"></div></div>\n" +
    "<div class=\"ne-video\" ng-if=\"video.host\" class=\"fade\">\n" +
    "    <div class=\"ne-video-preview\" ng-hide=\"nePlayVideo\">\n" +
    "        <div class=\"ne-video-thumb\" ng-click=\"nePlayVideo=!nePlayVideo\">\n" +
    "            <img ng-src=\"{{video.thumbnail}}\" alt=\"\"/>\n" +
    "            <i class=\"fa fa-play-circle-o\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"ne-video-detail\">\n" +
    "            <div class=\"ne-video-title\">\n" +
    "                <a ng-href=\"{{video.url}}\">{{video.title}}</a>\n" +
    "            </div>\n" +
    "            <div class=\"ne-video-desc\">\n" +
    "                {{video.description}}\n" +
    "            </div>\n" +
    "            <div class=\"ne-video-stats\">\n" +
    "                <span><i class=\"fa fa-eye\"></i> {{video.views}}</span>\n" +
    "                <span><i class=\"fa fa-heart\"></i> {{video.likes}}</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"ne-video-player\" ng-if=\"nePlayVideo\">\n" +
    "        <iframe ng-src=\"{{video.embedSrc}}\" frameBorder=\"0\" width=\"{{video.width}}\" height=\"{{video.height}}\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<!---video player for mp4 and other html5 player supported videos---->\n" +
    "\n" +
    "<div class=\"un-video\" ng-if=\"video.basic\">\n" +
    "    <div class=\"ne-video-player\">\n" +
    "        <div class=\"player\">\n" +
    "            <video ng-src=\"{{video.basic}}\" controls></video>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<!-- image preview code (gif|jpg|jpeg|tiff|png|svg|webp) --->\n" +
    "\n" +
    "<div ng-init=\"neImageLong=false\" ng-class=\"{false:'un-image', true:'un-image-long'}[neImageLong]\"\n" +
    "     ng-if=\"image.url\">\n" +
    "    <div class=\"ne-image-wrapper\">\n" +
    "        <img ng-src=\"{{image.url}}\" ng-click=\"neImageLong=!neImageLong\" alt=\"\"/>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"ne-pdf\" ng-if=\"pdf.url\">\n" +
    "    <div class=\"ne-pdf-preview\" ng-hide=\"neShowPdf\">\n" +
    "        <div class=\"ne-pdf-icon\">\n" +
    "            <i class=\"fa fa-file-pdf-o\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"ne-pdf-detail\" >\n" +
    "            <div class=\"ne-pdf-title\">\n" +
    "                <a href=\"\">{{pdf.url}}</a>\n" +
    "            </div>\n" +
    "            <div class=\"ne-pdf-view\">\n" +
    "                <button><i class=\"fa fa-download\"></i> <a ng-href=\"{{pdf.url}}\" target=\"_blank\">Download</a></button>\n" +
    "                <button ng-click=\"neShowPdf=!neShowPdf\"><i class=\"fa fa-eye\"></i> View PDF</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!--====== pdf viewer =========-->\n" +
    "\n" +
    "    <div class=\"ne-pdf-viewer\" ng-if=\"neShowPdf\" ng-show=\"neShowPdf\">\n" +
    "        <iframe ng-src=\"{{pdf.url}}\" frameBorder=\"0\"></iframe>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<!--===== audio player ===========-->\n" +
    "\n" +
    "<div class=\"ne-audio\" ng-if=\"audio.url\">\n" +
    "    <audio ng-src=\"{{audio.url}}\" controls></audio>\n" +
    "</div>"
  );


  $templateCache.put('views/unchatbar-data-chat/send-box.html',
    "<div class=\"send-box\" data-ng-show=\"channel\">\n" +
    "    <form>\n" +
    "        <label for=\"input-message\" translate>Your message</label>\n" +
    "        <div class=\"send-input\">\n" +
    "                <textarea enter-submit=\"sendTextMessage(userMap,channel);text='';\"\n" +
    "                          id=\"input-message\"\n" +
    "                          cols=\"1\"\n" +
    "                          c\n" +
    "                          msd-elastic=\"\\n\"\n" +
    "                          autocomplete=\"off\"\n" +
    "                          data-ng-model=\"text\" class=\"form-control input-sm\"\n" +
    "                          placeholder=\"{{'Enter your message' | translate }}\"></textarea>\n" +
    "          <span class=\"send-button\">\n" +
    "            <button type=\"button\" data-ng-click=\"sendTextMessage(userMap,channel);text='';\">\n" +
    "                <i class=\"fa fa-comment\"></i></button>\n" +
    "          </span>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n"
  );


  $templateCache.put('views/unchatbar-data-chat/send-file.html',
    "<div class=\"un-send-file\" data-ng-show=\"channel\" >\n" +
    "    <i></i>\n" +
    "    <input class=\"upload\" type=\"file\" un-file-reader>\n" +
    "</div>"
  );


  $templateCache.put('views/unchatbar-data-chat/unread-message.html',
    "<ul role=\"menu\" data-ng-init=\"showMessage=false\"\n" +
    "    class=\"data-chat-list-unread\"\n" +
    "        style=\"display: block;\">\n" +
    "    <li class=\"chat-header\">\n" +
    "        <span class=\"chat-text\" translate>You have {{unreadMessageList.length || 0}} Messages</span>\n" +
    "    </li>\n" +
    "    <li data-ng-repeat=\"message in unreadMessageList | orderBy:'sendStamp'\">\n" +
    "        <a ui-sref=\"channel({channel: message.channel})\" class=\"text-item\">\n" +
    "              <span class=\"profile-image\">\n" +
    "                <img alt=\"{{userMap[message.from].label}}\"\n" +
    "                     ng-src=\"{{userMap[message.from].image}}\" class=\"img-circle img-sm\">\n" +
    "              </span>\n" +
    "\n" +
    "            <div class=\"text-body\">\n" +
    "                <div class=\"text-message\">{{message.meta.text}}</div>\n" +
    "                <small class=\"text-date\">\n" +
    "                    {{getFormateDate(message.meta.date) | date:'dd/MM/yyyy @ H:mm' :'GMT'}}\n" +
    "                </small>\n" +
    "            </div>\n" +
    "        </a>\n" +
    "    </li>\n" +
    "</ul>\n"
  );

}]);
