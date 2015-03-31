angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('de', {"Enter your message":"Gib deine Nachricht ein","You have {{unreadMessageList.length || 0}} Messages":"Du hast {{unreadMessageList.length || 0}} Nachrichten","Your message":"Deine Nachricht","load more from history":"Lade letzte Nachrichten"});
/* jshint +W100 */
}]);