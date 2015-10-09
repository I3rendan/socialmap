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

  .directive('pollItemDir', function($timeout){
    return {
      restrict: 'A',
      link: function($scope, element){

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
    $scope.pollCount = -1;
    $scope.feedPosts = [];
    $scope.pollItems = [];
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



    $scope.loadPolls = function() {
      $http({method: 'GET', url: '/app/poll'}).
        success(function(data) {
          $scope.updatePolls(data);
        }).
        error(function(data, status) {
          console.log(status + ' - Could not load posts');
        });
    };

    $scope.updatePolls = function(data){
      $scope.pollItems = data;
      $scope.nextPoll();
    };

    $scope.rotatePoll = function(){
      if ($scope.pollCount < $scope.pollItems.length - 1){
        $timeout(function(){
          $scope.nextPoll();
        }, $scope.delaySlide * 10);
      } else {
        $scope.pollCount = -1;
        $scope.loadPolls();
      }
    };

    $scope.nextPoll = function(){
      $scope.pollCount++;
      if($scope.pollItems[$scope.pollCount].type === 'poll'){
        $scope.chartObject.data = [
         ['Text', 'Percent', { role: 'style' }, { role: 'annotation' }]
        ];
        _.each($scope.pollItems[$scope.pollCount].answers, function(item){

          $scope.chartObject.data.push([String(item.text), Number(item.value), '#e31837', item.value]);
        });
      }

      console.log($scope.pollCount + ' -- ' + $scope.pollItems.length);

      $scope.rotatePoll();
    };

    // Google Charts

    $scope.chartObject = {};
    
    $scope.chartObject.type = 'BarChart';
    
    $scope.chartObject.data = [];

    $scope.chartObject.options = {
      backgroundColor: 'transparent',
      legend: 'none',
      height: '100%',
      chartArea: {
        top: 5,
        height: '60%',
        width: '50%'
      },
      bar: {
        groupWidth: '33%'
      },
      animation: {
        duration: 1500,
        easing: 'inAndOut',
        startup: true
      }
    };



    $scope.updatePosts = function(data){
      $scope.feedPostsHeight = [];
      $scope.feedPosts = data;
    };

    $scope.loadPosts = function() {
      $http({method: 'GET', url: '/app/socialfeed/' + $scope.minPosts}).
      //$http({method: 'GET', url: '/feeds/feedSocial.json'}).
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

  });