console.log("LOAD");
angular.module('unchatbar-data-chat').directive('enterSubmit', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('keydown', function(event) {
                var code = event.keyCode || event.which;
                console.log("STEP1");
                if (code === 13) {
                    if (!event.shiftKey) {
                        event.preventDefault();
                        scope.$apply(attrs.enterSubmit);
                    }
                }
            });
        }
    }
});