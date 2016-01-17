(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments);
        }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

(function (window) {
    'use strict';

    try {
        var appInsights = window.appInsights || function (config) {
                function s(config) {
                    t[config] = function () {
                        var i = arguments;
                        t.queue.push(function () {
                            t[config].apply(t, i);
                        });
                    };
                }

                var t = {config: config}, r = document, f = window, e = "script", o = r.createElement(e), i, u;
                for (o.src = config.url || "//az416426.vo.msecnd.net/scripts/a/ai.0.js", r.getElementsByTagName(e)[0].parentNode.appendChild(o), t.cookie = r.cookie, t.queue = [], i = ["Event", "Exception", "Metric", "PageView", "Trace"]; i.length;) s("track" + i.pop());
                return config.disableExceptionTracking || (i = "onerror", s("_" + i), u = f[i], f[i] = function (config, r, f, e, o) {
                    var s = u && u(config, r, f, e, o);
                    return s !== !0 && t["_" + i](config, r, f, e, o), s;
                }), t;
            }({
                instrumentationKey: "f613dbaf-edba-4399-ad89-fef7d4235861"    //PROD-KEY
            });

        window.appInsights = appInsights;
        appInsights.trackPageView();

        /** init google analytics */
        ga("create", "UA-59300717-1", "auto");
        ga("send", "pageview");
    }
    catch (ex) {
        console.log("EXCEPTION: analytics trackers:: " + ex);
    }

})(window);
