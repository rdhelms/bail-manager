(function() {
  "use strict";

  angular.module('baseAngular', ['ui.router', 'LocalStorageModule'])
        .config(function($stateProvider, $urlRouterProvider) {
          $urlRouterProvider.otherwise('/');

          $stateProvider.state('main', {
            url: '/',
            templateUrl: 'src/views/main.html',
            controller: 'mainCtrl as main'
          }).state('main.first', {
            url: 'first',
            templateUrl: 'src/views/first.html',
            controller: 'firstCtrl as first'
          }).state('main.second', {
            url: 'second',
            templateUrl: 'src/views/second.html',
            controller: 'secondCtrl as second'
          });
        });
})();
;(function() {
  angular.module('baseAngular').service('MainService', function(localStorageService) {

  });
})();
;angular.module('baseAngular').controller('firstCtrl', function(MainService, $state, $scope) {
  var self = this;

  self.testingVariable = "First View";
});
;angular.module('baseAngular').controller('mainCtrl', function(MainService, $state, $scope) {
  var self = this;

  self.testingVariable = "Main View";
});
;angular.module('baseAngular').controller('secondCtrl', function(MainService, $state, $scope) {
  var self = this;

  self.testingVariable = "Second View";
});
