(function() {
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
          // console.log("Success: getInmates");
        },
        error: function(err) {
          // console.log("Error: getInmates");
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
          // console.log("Success: addInmate");
        },
        error: function(err) {
          // console.log("Error: addInmate");
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

    function getInmatesCSV() {
      var request = $.ajax({
        method: 'GET',
        url: 'https://inmatesearch.herokuapp.com/api/nc/durham/inmates/download',
        success: function(data) {
          // console.log("Success: getInmatesCSV");
        },
        error: function(err) {
          // console.log("Error: getInmatesCSV");
          console.log(err);
        }
      });
      return request;
    }

    return {
      setInmateList: setInmateList,
      getInmateList: getInmateList,
      getInmates: getInmates,
      addInmate: addInmateToManager,
      checkBailability: checkBailability,
      getInmatesCSV: getInmatesCSV
    };
  });
})();
