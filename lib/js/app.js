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
  angular.module('inmateManager').service('CrimesService', function(localStorageService) {

    var crimeList;

    function setCrimeList(newCrimeList) {
      crimeList = newCrimeList;
    }

    function getCrimeList() {
      if (crimeList) {
        return crimeList;
      } else {
        return [];
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
  angular.module('inmateManager').service('InmateService', function(localStorageService, CrimesService) {

    var inmateList;

    function setInmateList(newInmateList) {
      inmateList = newInmateList;
    }

    function getInmateList() {
      if (inmateList) {
        return inmateList;
      } else {
        return [];
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
  angular.module('inmateManager').service('ManagerService', function(localStorageService) {

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
;(function() {
  angular.module('inmateManager').service('UserService', function(localStorageService) {
    function signInUser(user) {
      var request = $.ajax({
        method: 'POST',
        url: 'https://inmatesearch.herokuapp.com/api/nc/durham/users',
        data: user
      });
      return request;
    }

      return {
        signInUser: signInUser
      };
  });
})();
;angular.module('inmateManager').controller('crimesCtrl', function(CrimesService, $state, $scope) {
  var self = this;

  self.updateCrime = function(crime) {
    CrimesService.updateCrime(crime).done(function(response) {
      console.log("Received Response: ");
      console.log(response);
    });
  };
});
;angular.module('inmateManager').controller('inmatesCtrl', function(InmateService, $state, $scope) {
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
;angular.module('inmateManager').controller('mainCtrl', function(InmateService, CrimesService, UserService, $state, $scope) {
  var self = this;

  self.signedIn = false;
  self.loading = true;
  self.user = getUser();
  self.validUser = false;

  self.crimeList = CrimesService.getCrimeList();
  self.inmateList = InmateService.getInmateList();

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

  function signInInmateUser(user) {
    // If the user is new, API will POST a new user to the db and return the user info.
    // If the user is existing, API will return the user info
    // User will be marked as registeredUser.super (true or false)
    UserService.signInUser(user).done(function(response) {
      var bailFundUser = response.result.value;
      console.log("Registered User:", bailFundUser);
      if (bailFundUser.super) {
        getCrimes();
        getInmates();
        self.validUser = true;
      }
      self.signedIn = true;
      self.user = bailFundUser;
      $scope.$apply();
    }).fail(function(err) {
      console.log("Error getting Registered User", err);
      self.signOut();
    });
  }

  self.updateCrime = function(crime) {
    CrimesService.updateCrime(crime).done(function(response) {
    });
  };

  self.signIn = function() {
    signIn();
  };

  self.signOut = function() {
    self.validUser = false;
    signOut();
  };

  // Google Info
  var apiKey = 'AIzaSyCnkQqRkK-S9tWGZkRnjNVeVGwYsAZG5D4';
  var clientId = '80279716609-tbtbobnu30bdoq56imdr0a9gncqcn4il.apps.googleusercontent.com';
  var user = {
      name: null,
      uid: null,
      token: null,
      picture: null,
  };

  //Get the current values for user data
  function getUser() {
    return user;
  }

  var auth2;
  // When the api has loaded, run the init function.
  gapi.load('client:auth2', initAuth);

  // Get authorization from the user to access profile info
  function initAuth() {
      gapi.client.setApiKey(apiKey); // Define the apiKey for requests
      gapi.auth2.init({ // Define the clientId and the scopes for requests
          client_id: clientId,
          scope: 'profile'
      }).then(function() {
          auth2 = gapi.auth2.getAuthInstance(); // Store authInstance for easier accessibility
          auth2.isSignedIn.listen(updateSignInStatus);
          updateSignInStatus(auth2.isSignedIn.get());
      });
  }

  function updateSignInStatus(isSignedIn) {
      if (isSignedIn) {
        getLogin();
      } else {
        self.signedIn = false;
        $scope.$apply();
      }
  }

  // Sign the user in to their google account when the sign in button is clicked
  function signIn() {
      auth2.signIn({
          prompt: 'login'
      });
  }

  // Sign the user out of their google account when the sign out button is clicked
  function signOut() {
      auth2.signOut();
  }

  // Get the name of the user who signed in.
  function getLogin() {
      var requestUser = gapi.client.request({
          path: 'https://people.googleapis.com/v1/people/me',
          method: 'GET'
      });
      requestUser.then(function(response) {
          console.log("Google User info:", response);
          console.log("Google auth info:", auth2.currentUser);
          user.name = response.result.names[0].displayName;
          user.picture = response.result.photos[0].url;
          user.uid = auth2.currentUser.Ab.El;
          user.token = auth2.currentUser.Ab.Zi.access_token;
          // Send the user info to the API.
          signInInmateUser(user);
      });
  }

});
;angular.module('inmateManager').controller('managerCtrl', function(InmateService, $state, $scope) {
  var self = this;
});
