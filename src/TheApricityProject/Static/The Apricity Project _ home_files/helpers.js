/**
 *  Helper functions
 */
(function (window) {
    'use strict';

    window.linkify = function linkify(inputText) {
        //URLs starting with http://, https://, or ftp://
        var replacedText,
            replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim,
            replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim,
            replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;

        try {
            replacedText = inputText.replace(replacePattern1, "<a href=$1 target=_blank>$1</a>");
            //URLs starting with "www." (without // before it, or it"d re-link the ones done above).
            replacedText = replacedText.replace(replacePattern2, "$1<a href=http://$2' target=_blank>$2</a>");
            //Change email addresses to mailto:: links.
            replacedText = replacedText.replace(replacePattern3, "<a href=mailto:$1>$1</a>");

            return replacedText;
        } catch (ex) {
            console.warn("exception:gaEvent::" + ex);
        }
    }

    window.gaEvent = function gaEvent(action, gae) {
        try {
            if (gae === undefined || gae === null || gae === '')
                gae = 'event';
            ga('send', gae, 'Widget-2.1', action, globalWidgetSettings.bontactId);
            console.log(action);
        }
        catch (ex) {
            console.warn("exception:gaEvent::" + ex);
        }
    }

    window.isLegacyIE = function isLegacyIE(version) {
        var result = false;

        if (version === undefined)
            version = 8;

        if (($.ua.browser.name === 'IE' && $.ua.browser.version == version)) {
            result = true;
        }
        return result;
    };

})(window);

/**
 *  PROTOYPES AND EXTENTIONS
 */
(function () {
    'use strict';

    Element.prototype.remove = function () {
        this.parentElement.removeChild(this);
    };

    NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    };

    String.format = function () {
        var theString = arguments[0], i, regEx;
        for (i = 1; i < arguments.length; i++) {
            regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
            theString = theString.replace(regEx, arguments[i]);
        }
        return theString;
    };

    String.prototype.format = function (values) {

        var regex = /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g;

        var getValue = function (key) {
            if (values == null || typeof values === 'undefined') return null;

            var value = values[key];
            var type = typeof value;

            return type === 'string' || type === 'number' ? value : null;
        };

        return this.replace(regex, function (match) {
            //match will look like {sample-match}
            //key will be 'sample-match';
            var key = match.substr(1, match.length - 2);

            var value = getValue(key);

            return value != null ? value : match;
        });
    };

})();
