(function() {
  "use strict";

  angular.module('inmateManager', ['ui.router', 'LocalStorageModule'])
        .config(function($stateProvider, $urlRouterProvider) {
          $urlRouterProvider.otherwise('/');

          $stateProvider.state('main', {
            url: '/',
            templateUrl: 'src/views/main.html',
            controller: 'mainCtrl as main'
          }).state('main.inmates', {
            url: 'people',
            templateUrl: 'src/views/inmates.html',
            controller: 'inmatesCtrl as inmates'
          }).state('main.crimes', {
            url: 'parameters',
            templateUrl: 'src/views/crimes.html',
            controller: 'crimesCtrl as crimes'
          }).state('main.manager', {
            url: 'manager',
            templateUrl: 'src/views/manager.html',
            controller: 'managerCtrl as manager'
          });
        });
})();
