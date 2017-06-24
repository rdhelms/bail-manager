angular.module('inmateManager').controller('crimesCtrl', function(CrimesService, $state, $scope) {
  var self = this;

  self.updateCrime = function(crime) {
    CrimesService.updateCrime(crime).done(function(response) {
      console.log("Received Response: ");
      console.log(response);
    });
  };
});
