'use strict';

angular
  .module('socialmapApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'mappy'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
