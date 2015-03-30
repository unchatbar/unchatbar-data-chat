angular.module('unchatbar-data-chat').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/unchatbar-data-chat/message-box.html',
    "<div class=\"text-center\" data-ng-click=\"limit=limit+10\" title=\"load more from history\">\n" +
    "    <i class=\"fa fa-history fa-2x\"></i>\n" +
    "</div>\n" +
    "\n" +
    "<ul class=\"list-unstyled\" data-ng-init=\"limit=10\">\n" +
    "\n" +
    "    <li class=\"mar-btm\" data-ng-repeat=\"message in messageList | limitTo:(limit*-1) | orderBy:'sendStamp'\">\n" +
    "        <div data-ng-class=\"{'media-left' : ownPeerId === message.from,'media-right' : ownPeerId !== message.from}\" >\n" +
    "            <img class=\"img-circle img-sm\" ng-src=\"{{userMap[message.from].image}}\" width=\"80\">\n" +
    "        </div>\n" +
    "        <div class=\"media-body pad-hor\" data-ng-class=\"{'speech-right' : ownPeerId !== message.from}\">\n" +
    "            <div class=\"speech\">\n" +
    "                <a href=\"#\" class=\"media-heading\">{{userMap[message.from].label}}</a>\n" +
    "\n" +
    "                <p>\n" +
    "                    <ng-emoticons emoticons-template-url=\"views/unchatbar-data-chat/message.html\"\n" +
    "                                  emoticons-data=\"message.message.text\" emoticons-options=\"options\"/>\n" +
    "                </p>\n" +
    "\n" +
    "                <p class=\"speech-time\">\n" +
    "                    <i class=\"fa fa-clock-o fa-fw\"></i> {{getFormateDate(message.message.meta.date) |\n" +
    "                    date:'dd/MM/yyyy @ H:mm' :'GMT'}}\n" +
    "                </p>\n" +
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
    "<form class=\"send-box\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"sr-only\" for=\"input-message\" translate>Your message</label>\n" +
    "\n" +
    "        <div class=\"input-group\">\n" +
    "                <textarea enter-submit=\"sendTextMessage(userMap,channel);text='';\"\n" +
    "                          id=\"input-message\"\n" +
    "                          class=\"form-control input-sm\"\n" +
    "                          cols=\"1\"\n" +
    "                          msd-elastic=\"\\n\"\n" +
    "                          autocomplete=\"off\"\n" +
    "                          data-ng-model=\"text\" class=\"form-control input-sm\"\n" +
    "                          placeholder=\"{{'Enter your message' | translate }}\"></textarea>\n" +
    "          <span class=\"input-group-btn\">\n" +
    "            <button type=\"button\" class=\"btn btn-inverse btn-sm\" data-ng-click=\"sendTextMessage(userMap,channel);text='';\">\n" +
    "                <i class=\"fa fa-comment\"></i></button>\n" +
    "          </span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n"
  );


  $templateCache.put('views/unchatbar-data-chat/unread-message.html',
    "<div data-ng-init=\"showMessage=false\">\n" +
    "    <div class=\"notification-icon fa-2x\" data-ng-click=\"showMessage=!showMessage\">\n" +
    "        <span class=\"glyphicon glyphicon-envelope\"></span>\n" +
    "        <span class=\"badge\">{{unreadMessageList.length || 0}}</span>\n" +
    "    </div>\n" +
    "    <div class=\"panel panel-primary new-message-box\" data-ng-show=\"showMessage\">\n" +
    "        <div class=\"panel-body\" scroll-glue>\n" +
    "            <ul class=\"chat\">\n" +
    "                <li class=\"left clearfix\" data-ng-show=\"unreadMessageList.length === 0\">\n" +
    "                    no new Messages\n" +
    "                </li>\n" +
    "                <li class=\"left clearfix\" data-ng-repeat=\"message in unreadMessageList | orderBy:'sendStamp'\">\n" +
    "                    <a ui-sref=\"channel({channel: message.channel})\">\n" +
    "                            <span class=\"chat-img pull-left\">\n" +
    "                            <img class=\"profile-image\" ng-src=\"{{userMap[message.from].image}}\" width=\"80\">\n" +
    "                        </span>\n" +
    "\n" +
    "                        <div class=\"chat-body clearfix\">\n" +
    "\n" +
    "                            <div class=\"header\">\n" +
    "                                <strong class=\"primary-font\">{{userMap[message.from].label}}</strong>\n" +
    "                                <small class=\"pull-right text-muted\">\n" +
    "                                    <span class=\"glyphicon glyphicon-time\"></span>\n" +
    "                                    {{getFormateDate(message.message.meta.date) | date:'dd/MM/yyyy @ H:mm' :'GMT'}}\n" +
    "                                </small>\n" +
    "\n" +
    "                            </div>\n" +
    "                            <p>\n" +
    "                                {{message.message.text}}\n" +
    "                            </p>\n" +
    "                        </div>\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );

}]);
