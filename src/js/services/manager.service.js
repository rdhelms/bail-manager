(function() {
  angular.module('inmateManager').service('ManagerService', function(localStorageService) {

    function getInmates() {
      var request = $.ajax({
        method: 'GET',
        url: 'https://inmatesearch.herokuapp.com/api/nc/durham/inmates',
        success: function(data) {
        },
        error: function(err) {
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
        },
        error: function(err) {
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
