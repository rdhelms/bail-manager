angular.module('baseAngular').controller('mainCtrl', function(InmateService, $state, $scope) {
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
