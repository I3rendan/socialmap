'use strict';

angular.module('socialmapApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.data = {
      'GB': {metric: 4},
      'US': {metric: 25},
      'CA': {metric: 5},
      'BR': {metric: 2},
      'RU': {metric: 33},
      'AR': {metric: 5},
      'CN': {metric: 85},
      'DE': {metric: 13},
      'BE': {metric: 32},
      'ES': {metric: 23},
      'IR': {metric: 1},
      'AF': {metric: 13},
      'MR': {metric: 14},
      'FR': {metric: 29},
      'IN': {metric: 3},
      'FI': {metric: 15},
      'AU': {metric: 100}
    };

    $scope.mapPathData = window._mapPathData;

    $scope.mapDataHumanizeFn = function(val) { return val + ' people'; };

    $scope.heatmapColors = ['#5aa4e9','#48d555','#ef3636'];

  });