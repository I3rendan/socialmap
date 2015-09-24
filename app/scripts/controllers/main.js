'use strict';

angular.module('socialmapApp')
  .directive('socialItem', function($timeout){
    return {
      restrict: 'A',
      link: function($scope, element){
        $scope.getSocial = $timeout(function(){
          $scope.feedPostsHeight.push(element.outerHeight(true));
          if ($scope.$last){
            $scope.sortSocial($scope.feedPostsHeight);
          }
        });
      }
    };
  })

  .controller('MainCtrl', function ($scope, $http, $timeout, $window) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.postStatus = 'init';
    $scope.delaySlide = 3600;
    $scope.animationSpeed = 1200;
    $scope.minPosts = 12;
    $scope.feedPosts = [];
    $scope.feedPostsHeight = [];

    $scope.shuffleArray = function(array) {
      var m = array.length, t, i;
      while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }
      return array;
    };

    $scope.updatePosts = function(data){
      $scope.feedPostsHeight = [];
      $scope.feedPosts = data;
    };

    $scope.loadPosts = function() {
      //$http({method: 'GET', url: '/feeds/feedSocial.json' + $scope.minPosts}).
      $http({method: 'GET', url: '/feeds/feedSocial.json'}).
        success(function(data) {

          if ($scope.postStatus === 'init') {
            $scope.postStatus = 'running';
            $scope.updatePosts(data.feed);
          }
          else if (data.length < $scope.minPosts){
            if (String($scope.feedPosts) !== String(data) && $scope.postStatus !== 'delayed'){
              $scope.feedPosts.push.apply($scope.feedPosts, data.feed);
              $scope.postStatus = 'delayed';
            } else {
              $timeout(function(){
                $scope.loadPosts();
              }, $scope.delaySlide * 3);
            }
          } else {
            if (data.playListOrder === 'random'){
              $scope.feedPosts.push.apply($scope.feedPosts, $scope.shuffleArray(data.feed));
              $scope.postStatus = 'running';
            } else {
              $scope.feedPosts.push.apply($scope.feedPosts, data.feed);
              $scope.postStatus = 'running';
            }
          }
        }).
        error(function(data, status) {
          console.log(status + ' - Could not load posts');
        });
    };

    $scope.removePost = function(){
      angular.element('#social0').slideUp($scope.animationSpeed, function(){
        $scope.feedPosts.shift();
        $scope.feedPostsHeight.shift();
        $scope.$apply();

        if ($scope.feedPosts.length <= $scope.minPosts){
          $scope.loadPosts();
        } else {
          $scope.sortSocial($scope.feedPostsHeight);
        }
      });
    };

    $scope.sortSocial = function(data){
      var findMin = 0;
      var findVH = $window.innerHeight;

      for (var i = 0; i < data.length; i++) {
        findMin += data[i];
        if (findMin >= findVH){
          $scope.minPosts = Math.round(i) * 1.5;

          if ($scope.postStatus === 'delayed'){
            $scope.minPosts = Math.round(i);
          }

          i = data.length;
          $scope.delaySocialRemove();
        }
      }
      if (findMin < findVH){
        $scope.minPosts = Math.round(findVH / findMin) * i;

        $timeout(function(){
          $scope.loadPosts();
        }, $scope.delaySlide);
      }
    };

    $scope.delaySocialRemove = function(){
      $timeout(function(){
        $scope.removePost();
      }, $scope.delaySlide * 1.33);
    };

    $scope.data = {
      'GB': {metric: 4},
      'US': {metric: 25},
      'CA': {metric: 5},
      'BR': {metric: 75},
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
      'IN': {metric: 50},
      'FI': {metric: 15},
      'AU': {metric: 100}
    };

    // Map Stuff

    $scope.mapPathData = window._mapPathData;

    $scope.mapDataHumanizeFn = function(val) { return val + ' people'; };

    $scope.heatmapColors = ['#0073cf','#e31837'];

    // Google Charts

    $scope.chartObject = {};
    
    $scope.chartObject.type = 'BarChart';
    
    $scope.onions = [
      {v: 'Facebook'},
      {v: 3},
    ];

    $scope.chartObject.data = {'cols': [
      {id: 't', label: 'Topping', type: 'string'},
      {id: 's', label: 'Slices', type: 'number'}
    ], 'rows': [
        {c: $scope.onions},
        {c: [
            {v: 'Twitter'},
            {v: 31}
          ]},
          {c: [
              {v: 'Instagram'},
              {v: 85},
            ]},
            {c: [
                {v: 'Reddit'},
                {v: 27},
              ]}
            ]};

    $scope.chartObject.options = {
      'legend': 'none',
      'backgroundColor': 'transparent',
      'height': '100%',
      'width': '100%',
      'colors': ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
      'animation':{
        'duration': 1500,
        'easing': 'inAndOut',
        'startup': true
      }
    };

  });