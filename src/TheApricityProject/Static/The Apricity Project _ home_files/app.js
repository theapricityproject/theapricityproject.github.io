'use strict';

angular.module('bontactWidget', [
    'ngSanitize'
])
    .constant('_', window._)

    .provider('logEnhancer', function () {
        this.loggingPattern = '%s - %s: ';

        this.$get = function () {
            var loggingPattern = this.loggingPattern;
            return {
                enhanceAngularLog: function ($log) {
                    $log.getInstance = function (context) {
                        return {
                            log: enhanceLogging($log.log, context),
                            info: enhanceLogging($log.info, context),
                            warn: enhanceLogging($log.warn, context),
                            debug: enhanceLogging($log.debug, context),
                            error: enhanceLogging($log.error, context)
                        };
                    };

                    function enhanceLogging(loggingFunc, context) {
                        return function () {
                            var modifiedArguments = [].slice.call(arguments);
                            modifiedArguments[0] = [moment().format("dddd h:mm:ss a") + '::[' + context + ']> '] + modifiedArguments[0];
                            loggingFunc.apply(null, modifiedArguments);
                        };
                    }
                }
            };
        };
    })

    .run(function ($log, logEnhancer) {
        logEnhancer.enhanceAngularLog($log);
    });
