(function() {
  angular.module('baseAngular').service('CrimesService', function(localStorageService) {

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
      updateCrime: updateCrime
    };
  });
})();
