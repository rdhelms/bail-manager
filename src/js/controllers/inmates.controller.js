angular.module('baseAngular').controller('inmatesCtrl', function(InmateService, $state, $scope) {
  var self = this;

  self.loading = true;
  self.inmateList = [];
  self.searchChargesType = 'lessThan';
  self.searchBailType = 'lessThan';
  self.searchNumCharges;
  self.searchBailAmount;

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
  };

  self.searchCharges = function(inmate) {
    if (!self.searchNumCharges) {
      return true;
    } else if (self.searchChargesType == 'exact' && inmate.charges.length == self.searchNumCharges) {
      return true;
    } else if (self.searchChargesType == 'lessThan' && inmate.charges.length <= self.searchNumCharges) {
      return true;
    } else if (self.searchChargesType == 'greaterThan' && inmate.charges.length >= self.searchNumCharges) {
      return true;
    }
    return false;
  };

  self.searchTotalBail = function(inmate) {
    if (!self.searchBailAmount) {
      return true;
    } else if (self.searchBailType == 'exact' && inmate.totalBailAmount == self.searchBailAmount) {
      return true;
    } else if (self.searchBailType == 'lessThan' && inmate.totalBailAmount <= self.searchBailAmount) {
      return true;
    } else if (self.searchBailType == 'greaterThan' && inmate.totalBailAmount >= self.searchBailAmount) {
      return true;
    }
    return false;
  };

});
