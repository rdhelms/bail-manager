(function() {
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
