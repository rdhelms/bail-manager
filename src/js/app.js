(function() {
  "use strict";

  angular.module('portfolio', ['ui.router', 'LocalStorageModule'])
        .config(function($stateProvider, $urlRouterProvider) {
          $urlRouterProvider.otherwise('/');

          $stateProvider.state('portfolio', {
            url: '/',
            abstract: true,
            template: '<ui-view></ui-view>'
          }).state('portfolio.projects', {
            url: '',
            templateUrl: '../src/views/projects.html',
            controller: 'projectsCtrl as projects'
          }).state('portfolio.contact', {
            url: 'contact',
            templateUrl: '../src/views/contact.html',
            controller: 'contactCtrl as contact'
          });
        });

})();
