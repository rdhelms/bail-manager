angular.module('inmateManager').controller('crimesCtrl', function(CrimesService, LabelService, $state, $scope) {
  var self = this;
  self.sortType = '-bailable';

  self.sort = function(type) {
    if (self.sortType == type) {
      self.sortType = '-' + type;
    } else if (self.sortType == '-' + type) {
      self.sortType = type;
    } else {
      self.sortType = type;
    }
  };

  self.updateCrime = function(crime) {
    crime.label = undefined;
    CrimesService.updateCrime(crime).done(function(response) {
      // console.log("Received Response: ", response);
    });
  };

  self.addNewLabel = function(crime) {
    var labelName = prompt('Enter a name for the label: ');
    var newLabel = {
      name: labelName,
      bailable: crime.bailable
    };
    LabelService.createLabel(newLabel).done(function(response) {
      // console.log("createLabel Response: ", response);
    });
    $scope.main.labelList = LabelService.getLabelList();
    $scope.main.labelList.push(newLabel);
    LabelService.setLabelList($scope.main.labelList);
    crime.label = newLabel;
    CrimesService.updateCrime(crime).done(function(response) {
      // console.log("updateCrime Response: ", response);
    });
  };

  self.updateCrimeLabel = function(crime) {
    if (!crime.label) {
      crime.bailable = "Null";
    } else {
      crime.bailable = crime.label.bailable;
      CrimesService.updateCrime(crime).done(function(response) {
        // console.log("updateCrime Response: ", response);
      });
    }
  };
});
