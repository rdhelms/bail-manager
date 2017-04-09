angular.module('baseAngular').controller('mainCtrl', function(InmateService, CrimesService, $state, $scope) {
  var self = this;
  self.loading = true;
  self.testing = "Testing stuff";

  self.crimeList = CrimesService.getCrimeList() || getCrimes();
  self.inmateList = InmateService.getInmateList() || getInmates();

  function getCrimes() {
    CrimesService.getCrimes().done(function(response) {
      response.forEach(function(crime) {
        if (!crime.bailable || crime.bailable == "Maybe") {
          crime.bailable = "Null";
          self.updateCrime(crime);
        }
      });
      CrimesService.setCrimeList(response);
      self.loadingCrimes = false;
      self.crimeList = CrimesService.getCrimeList();
      $scope.$apply();
    });
  }

  function getInmates() {
      InmateService.getInmates().done(function(response) {
        response.forEach(function(inmate) {
          InmateService.checkBailability(inmate);
        });
        InmateService.setInmateList(response);
        self.loadingInmates = false;
        self.inmateList = InmateService.getInmateList();
        $scope.$apply();
      });
  }

  if (!self.loadingCrimes && !self.loadingInmates) {
    self.loading = false;
  }

  self.updateCrime = function(crime) {
    CrimesService.updateCrime(crime).done(function(response) {
      console.log("Received Response: ");
      console.log(response);
    });
  };

});
