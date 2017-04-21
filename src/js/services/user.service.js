angular.module('baseAngular').service('UserService', function(localStorageService, CrimesService) {
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
