angular.module('baseAngular').controller('crimesCtrl', function(CrimesService, $state, $scope) {
  var self = this;

  self.loading = true;
  self.crimeList = [];

  CrimesService.getCrimes().done(function(response) {
    self.crimeList = response;
    self.crimeList.forEach(function(crime) {
      if (!crime.bailable) {
        crime.bailable = "Maybe";
        self.updateCrime(crime);
      }
    });
    self.loading = false;
    $scope.$apply();
  });

  self.updateCrime = function(crime) {
    CrimesService.updateCrime(crime).done(function(response) {
      console.log("Received Response: ");
      console.log(response);
    });
  };
});
