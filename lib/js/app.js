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
;angular.module('baseAngular').service('UserService', function(localStorageService, CrimesService) {
    // Google Info
    var apiKey = 'AIzaSyCnkQqRkK-S9tWGZkRnjNVeVGwYsAZG5D4';
    var clientId = '80279716609-tbtbobnu30bdoq56imdr0a9gncqcn4il.apps.googleusercontent.com';
    var user = {
        name: null,
        uid: null,
        token: null,
        username: null,
        picture: null,
        id: null,
        joined: null
    };
    var loggedIn = false;

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
          $('.signInBtn').hide();
          $('.signOutBtn').show();
          $('.signInWelcome').show();
          getLogin();
        } else {
          $('.signInBtn').show();
          $('.signOutBtn').hide();
          $('.signInWelcome').hide();
          loggedIn = false;
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
            user.name = response.result.names[0].displayName;
            user.picture = response.result.photos[0].url;
            user.uid = auth2.currentUser.Ab.El;
            user.token = auth2.currentUser.Ab.Zi.access_token;
            loggedIn = true;
            /*$.ajax({
                method: 'PATCH',
                url: 'https://forge-api.herokuapp.com/users/login',
                data: {
                    uid: user.uid,
                    token: user.token
                },
                success: function(response) {
                    user.joined = response.created_at;
                    user.username = response.username;
                    user.id = response.id;
                    setTimeout(function() {
                      PopupService.openTemp('welcome');
                    }, 500);
                    loggedIn = true;
                },
                error: function(error) {
                    if (error.status === 404) {
                        // $('#register-form').css('display', 'flex');
                        PopupService.open('user-register');
                    } else if (error.status === 0) {
                        // Do nothing
                    } else {
                        PopupService.openTemp('fail-user-load');
                        signOut();
                    }
                }
            });*/
        });
    }

    function registerUser(username) {
        user.username = username;
        $.ajax({
            method: 'POST',
            url: 'https://forge-api.herokuapp.com/users/create',
            data: {
                username: user.username,
                uid: user.uid,
                token: user.token
            },
            success: function(response) {
                user.id = response.id;
                PopupService.close();
            },
            error: function(error) {
              PopupService.close();
              PopupService.openTemp('fail-user-load');
                signOut();
            }
        });
    }

    function editUsername(newName) {
      console.log(newName);
        user.username = newName;
        return $.ajax({
          method: 'PATCH',
          url: 'https://forge-api.herokuapp.com/users/update',
          headers: {
              user_id: user.id,
              token: user.token
          },
          data: {
            username: newName
          },
          success: function (response) {
            return response;
          },
          error: function (error) {

          }
        });
    }

    return {
        getUser: getUser,
        register: registerUser,
        editUsername: editUsername,
        signOut: signOut,
        signIn: signIn
    };
});
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

  self.signedIn = false;
  self.loading = true;
  self.user = getUser();

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

  self.signIn = function() {
    signIn();
  };

  self.signOut = function() {
    signOut();
  };

  // Google Info
  var apiKey = 'AIzaSyCnkQqRkK-S9tWGZkRnjNVeVGwYsAZG5D4';
  var clientId = '80279716609-tbtbobnu30bdoq56imdr0a9gncqcn4il.apps.googleusercontent.com';
  var user = {
      name: null,
      uid: null,
      token: null,
      username: null,
      picture: null,
      id: null,
      joined: null
  };
  var loggedIn = false;

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
        loggedIn = false;
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
          user.name = response.result.names[0].displayName;
          user.picture = response.result.photos[0].url;
          user.uid = auth2.currentUser.Ab.El;
          user.token = auth2.currentUser.Ab.Zi.access_token;
          self.user = user;
          loggedIn = true;
          self.signedIn = true;
          $scope.$apply();
          /*$.ajax({
              method: 'PATCH',
              url: 'https://forge-api.herokuapp.com/users/login',
              data: {
                  uid: user.uid,
                  token: user.token
              },
              success: function(response) {
                  user.joined = response.created_at;
                  user.username = response.username;
                  user.id = response.id;
                  setTimeout(function() {
                    PopupService.openTemp('welcome');
                  }, 500);
                  loggedIn = true;
              },
              error: function(error) {
                  if (error.status === 404) {
                      // $('#register-form').css('display', 'flex');
                      PopupService.open('user-register');
                  } else if (error.status === 0) {
                      // Do nothing
                  } else {
                      PopupService.openTemp('fail-user-load');
                      signOut();
                  }
              }
          });*/
      });
  }

  function registerUser(username) {
      user.username = username;
      $.ajax({
          method: 'POST',
          url: 'https://forge-api.herokuapp.com/users/create',
          data: {
              username: user.username,
              uid: user.uid,
              token: user.token
          },
          success: function(response) {
              user.id = response.id;
              PopupService.close();
          },
          error: function(error) {
            PopupService.close();
            PopupService.openTemp('fail-user-load');
              signOut();
          }
      });
  }

  function editUsername(newName) {
    console.log(newName);
      user.username = newName;
      return $.ajax({
        method: 'PATCH',
        url: 'https://forge-api.herokuapp.com/users/update',
        headers: {
            user_id: user.id,
            token: user.token
        },
        data: {
          username: newName
        },
        success: function (response) {
          return response;
        },
        error: function (error) {

        }
      });
  }

});
;angular.module('baseAngular').controller('managerCtrl', function(InmateService, $state, $scope) {
  var self = this;
});
