angular.module('inmateManager').controller('mainCtrl', function(InmateService, CrimesService, UserService, LabelService, $state, $scope) {
  var self = this;

  self.signedIn = false;
  self.loading = true;
  self.loadingLabels = true;
  self.loadingCrimes = true;
  self.loadingInmates = true;
  self.user = getUser();
  self.validUser = false;

  self.crimeList = CrimesService.getCrimeList();
  self.inmateList = InmateService.getInmateList();
  self.labelList = LabelService.getLabelList();

  function getCrimes() {
    CrimesService.getCrimes().done(function(crimeResponse) {
      LabelService.getLabels().done(function(labelResponse) {
        LabelService.setLabelList(labelResponse);
        self.loadingLabels = false;
        self.labelList = LabelService.getLabelList();

        crimeResponse.forEach(function(crime) {
          if (!crime.bailable) {
            crime.bailable = "Null";
            self.updateCrime(crime);
          }
          if (crime.label) {
            var labelIndex = -1;
            self.labelList.forEach(function(label) {
              if (label.name === crime.label.name) {
                crime.label = label;
              }
            });
          }
        });
        CrimesService.setCrimeList(crimeResponse);
        self.loadingCrimes = false;
        if (!self.loadingCrimes && !self.loadingInmates && !self.loadingLabels) {
          self.loading = false;
        }
        self.crimeList = CrimesService.getCrimeList();
        $scope.$apply();
      });
    });
  }

  function getInmates() {
    InmateService.getInmates().done(function(response) {
      response.forEach(function(inmate) {
        InmateService.checkBailability(inmate);
      });
      InmateService.setInmateList(response);
      self.loadingInmates = false;
      if (!self.loadingCrimes && !self.loadingInmates && !self.loadingLabels) {
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
