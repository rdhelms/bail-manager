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
  angular.module('baseAngular').service('InmateService', function(localStorageService) {

    function getInmates() {
      var request = $.ajax({
        method: 'GET',
        url: 'https://inmatesearch.herokuapp.com/api/nc/durham/inmates',
        success: function(data) {
          console.log("Success: getInmates");
        },
        error: function(err) {
          console.log("Error: getInmates");
          console.log(err);
        }
      });
      return request;
    }

    function addInmateToManager(inmate) {
      var request = $.ajax({
        method: 'POST',
        url: 'https://inmatesearch.herokuapp.com/api/inmatemanager/inmates',
        data: inmate,
        success: function(data) {
          console.log("Success: addInmate");
        },
        error: function(err) {
          console.log("Error: addInmate");
          console.log(err);
        }
      });
      return request;
    }

    return {
      getInmates: getInmates,
      addInmate: addInmateToManager
    };
  });
})();
;angular.module('baseAngular').controller('firstCtrl', function(InmateService, $state, $scope) {
  var self = this;
});
;angular.module('baseAngular').controller('mainCtrl', function(InmateService, $state, $scope) {
  var self = this;

  self.loading = true;
  self.inmateList = [];
  InmateService.getInmates().done(function(response) {
    self.inmateList = response;
    self.loading = false;
    $scope.$apply();
  });

  self.getInmates = function() {
    InmateService.getInmates().done(function(response) {
      console.log(response[0]);
      self.inmateList = response;
      self.loading = false;
      $scope.$apply();
    });
  };

  self.addInmate = function(inmate) {
    InmateService.addInmateToManager(inmate).done(function(response) {
      console.log(response);
    });
  }});
;angular.module('baseAngular').controller('secondCtrl', function(InmateService, $state, $scope) {
  var self = this;
});
