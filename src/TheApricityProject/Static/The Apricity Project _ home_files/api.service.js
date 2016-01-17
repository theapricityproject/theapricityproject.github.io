'use strict';

angular.module('bontactWidget')
    .factory('Api', function ($http, $q, $log) {
        $log = $log.getInstance('ApiService');
        var apiService = {
            settings: {
                server: {
                    serviceUrl: 'http://localhost:3817',
                    //TODO: change into const
                    services: {
                        login: {
                            uri: '/v1/authenticate/login',
                            method: 'POST'
                        },
                    }
                }
            },
            service: function (operation, params) {
                var dfd = $q.defer();

                $log.debug('operation', operation);
                $log.debug('params', params);

                var service = apiService.settings.server.services[operation],
                    baseUrl = apiService.settings.server.serviceUrl,
                    url = baseUrl + service.uri;

                $log.debug('service', service);
                $log.debug('baseUrl', baseUrl);
                $log.debug('url', url);

                //params.authenticationToken = localStorageService.get('authToken');

                $log.debug('service.method', service.method);
                $log.debug('params.authenticationToken', params.authenticationToken);

                var req = {
                    method: service.method,
                    url: url,
                    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                    cache: false
                };

                if (service.method == 'GET') {
                    req.params = params;
                } else {
                    req.data = params;
                }
                $log.debug('req', req);

                $http(req).then(function (response) {
                    $log.timeEnd(operation);
                    if (angular.isDefined(response.data.error)) {
                        $log.error(operation + ':: error: ', response.data.error);
                        dfd.reject(response.data.error);
                    }
                    else {
                        //returning our data as result
                        var result;
                        if (angular.isDefined(response.data.data)) {
                            result = response.data.data;
                            $log.debug('response', result);
                            $log.debug('result', JSON.stringify(result));
                            dfd.resolve(result);
                        } else {
                            result = response.data;
                            $log.debug('result', JSON.stringify(result));
                            dfd.resolve(response.data);
                        }
                    }
                }, function (response) {
                    $log.timeEnd(operation);
                    $log.error(operation + ':: error: ', response.error);

                    dfd.reject(response.error);
                });

                return dfd.promise;
            }
        };

        // Public API here
        return {
            service: apiService.service
        };
    });
