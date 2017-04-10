(function() {
  "use strict";

  angular.module('baseAngular', ['ui.router', 'LocalStorageModule'])
        .config(function($stateProvider, $urlRouterProvider) {
          $urlRouterProvider.otherwise('/');

          $stateProvider.state('main', {
            url: '/',
            templateUrl: 'src/views/main.html',
            controller: 'mainCtrl as main'
          }).state('main.inmates', {
            url: 'inmates',
            templateUrl: 'src/views/inmates.html',
            controller: 'inmatesCtrl as inmates'
          }).state('main.crimes', {
            url: 'crimes',
            templateUrl: 'src/views/crimes.html',
            controller: 'crimesCtrl as crimes'
          }).state('main.manager', {
            url: 'manager',
            templateUrl: 'src/views/manager.html',
            controller: 'managerCtrl as manager'
          });
        });
})();
;(function() {
  angular.module('baseAngular').service('CrimesService', function(localStorageService) {

    var crimeList;

    function setCrimeList(newCrimeList) {
      crimeList = newCrimeList;
    }

    function getCrimeList() {
      if (crimeList) {
        return crimeList;
      } else {
        return false;
      }
    }

    function getCrimes() {
      var request = $.ajax({
        method: 'GET',
        url: 'https://inmatesearch.herokuapp.com/api/nc/durham/crimes',
        success: function(data) {
          console.log("Success: getCrimes");
        },
        error: function(err) {
          console.log("Error: getCrimes");
          console.log(err);
        }
      });
      return request;
    }

    function updateCrime(crime) {
      var request = {
        query: {
          name: crime.name
        },
        update: {
          name: crime.name,
          bailable: crime.bailable
        }
      };
      var request = $.ajax({
        method: 'PUT',
        url: 'https://inmatesearch.herokuapp.com/api/nc/durham/crimes',
        data: request,
        success: function(data) {
          console.log("Success: updateCrime");
        },
        error: function(err) {
          console.log("Error: updateCrime");
          console.log(err);
        }
      });
      return request;
    }

    function addCrimeToManager(inmate) {
      var request = $.ajax({
        method: 'POST',
        url: 'https://inmatesearch.herokuapp.com/api/inmatemanager/crimes',
        data: inmate,
        success: function(data) {
          console.log("Success: addCrime");
        },
        error: function(err) {
          console.log("Error: addCrime");
          console.log(err);
        }
      });
      return request;
    }

    return {
      getCrimes: getCrimes,
      addCrime: addCrimeToManager,
      updateCrime: updateCrime,
      setCrimeList: setCrimeList,
      getCrimeList: getCrimeList
    };
  });
})();
;(function() {
  angular.module('baseAngular').service('InmateService', function(localStorageService, CrimesService) {

    var inmateList;

    function setInmateList(newInmateList) {
      inmateList = newInmateList;
    }

    function getInmateList() {
      if (inmateList) {
        return inmateList;
      } else {
        return false;
      }
    }

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

    function checkBailability(inmate) {
      var allBailableCharges = true;
      var crimeList = CrimesService.getCrimeList();
      inmate.charges.forEach(function(charge) {
        crimeList.forEach(function(crime) {
          if (charge.description == crime.name) {
            if (crime.bailable == "No") {
              allBailableCharges = false;
            }
          }
          if (charge.bondType == '[N/A]' || charge.bondType == 'NO BOND' || charge.bondType == 'NB') {
            allBailableCharges = false;
          }
        });
      });
      if (inmate.totalBailAmount <= 2000 && allBailableCharges) {
        inmate.bailability = "Yes";
      } else {
        inmate.bailability = "No";
      }
    }

    return {
      getInmates: getInmates,
      addInmate: addInmateToManager,
      checkBailability: checkBailability,
      setInmateList: setInmateList,
      getInmateList: getInmateList
    };
  });
})();
;(function() {
  angular.module('baseAngular').service('ManagerService', function(localStorageService) {

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
;angular.module('baseAngular').controller('crimesCtrl', function(CrimesService, $state, $scope) {
  var self = this;

  self.updateCrime = function(crime) {
    CrimesService.updateCrime(crime).done(function(response) {
      console.log("Received Response: ");
      console.log(response);
    });
  };
});
;angular.module('baseAngular').controller('inmatesCtrl', function(InmateService, $state, $scope) {
  var self = this;

  self.searchChargesType = 'lessThan';
  self.searchBailType = 'lessThan';
  self.searchNumCharges;
  self.searchBailAmount;
  self.totalBailAmount = 0;

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

});
;angular.module('baseAngular').controller('mainCtrl', function(InmateService, CrimesService, $state, $scope) {
  var self = this;
  self.loading = true;

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
      if (!self.loadingCrimes && !self.loadingInmates) {
        self.loading = false;
      }
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
        if (!self.loadingCrimes && !self.loadingInmates) {
          self.loading = false;
        }
        self.inmateList = InmateService.getInmateList();
        $scope.$apply();
      });
  }

  self.updateCrime = function(crime) {
    CrimesService.updateCrime(crime).done(function(response) {
    });
  };

});
;angular.module('baseAngular').controller('managerCtrl', function(InmateService, $state, $scope) {
  var self = this;
});
