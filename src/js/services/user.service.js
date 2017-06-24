(function() {
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
