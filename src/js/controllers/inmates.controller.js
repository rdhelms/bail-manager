angular.module('inmateManager').controller('inmatesCtrl', function(InmateService, $state, $scope) {
  var self = this;

  self.searchChargesType = 'lessThan';
  self.searchBailType = 'lessThan';
  self.searchNumCharges;
  self.searchBailAmount;
  self.totalBailAmount = 0;
  self.sortType = 'name';

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

  self.getStats = function() {
    self.totalBailAmount = 0;
    self.filterResults.forEach(function(inmate) {
      self.totalBailAmount += inmate.totalBailAmount;
    });
  };

  self.sort = function(type) {
    if (self.sortType == type) {
      self.sortType = '-' + type;
    } else if (self.sortType == '-' + type) {
      self.sortType = type;
    } else {
      self.sortType = type;
    }
  };

  self.getInmatesCSV = function() {
    window.open("https://inmatesearch.herokuapp.com/api/nc/durham/inmates/download");
  };

});
