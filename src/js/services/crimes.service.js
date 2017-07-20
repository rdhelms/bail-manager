(function() {
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
      var updateData = {
        query: {
          name: crime.name
        },
        update: {
          name: crime.name,
          bailable: crime.bailable
        }
      };
      if (crime.label) {
        var label = {
          name: crime.label.name,
          bailable: crime.label.bailable
        };
        updateData.update.label = label;
      }
      var request = $.ajax({
        method: 'PUT',
        url: 'https://inmatesearch.herokuapp.com/api/nc/durham/crimes',
        data: updateData,
        success: function(data) {
          // console.log("Success: updateCrime");
        },
        error: function(err) {
          console.log("Error: updateCrime");
          console.log(err);
        }
      });
      return request;
    }

    return {
      setCrimeList: setCrimeList,
      getCrimeList: getCrimeList,
      getCrimes: getCrimes,
      updateCrime: updateCrime
    };
  });
})();
