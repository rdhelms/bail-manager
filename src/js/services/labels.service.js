(function() {
  angular.module('inmateManager').service('LabelService', function(localStorageService) {
    var labelList;

    function setLabelList(newLabelList) {
      labelList = newLabelList;
    }

    function getLabelList() {
      if (labelList) {
        return labelList;
      } else {
        return [];
      }
    }

    function getLabels() {
      var request = $.ajax({
        method: 'GET',
        url: 'https://inmatesearch.herokuapp.com/api/nc/durham/labels',
        success: function(data) {
        },
        error: function(err) {
        }
      });
      return request;
    }

    function updateLabel(label) {
      var updateData = {
        query: {
          name: label.name
        },
        update: {
          name: label.name,
          bailable: label.bailable
        }
      };
      var request = $.ajax({
        method: 'PUT',
        url: 'https://inmatesearch.herokuapp.com/api/nc/durham/labels',
        data: updateData,
        success: function(data) {
        },
        error: function(err) {
        }
      });
      return request;
    }

    function createLabel(newLabel) {
      var request = $.ajax({
        method: 'POST',
        url: 'https://inmatesearch.herokuapp.com/api/nc/durham/labels',
        data: newLabel,
        success: function(data) {
        },
        error: function(err) {
        }
      });
      return request;
    }

    return {
      setLabelList: setLabelList,
      getLabelList: getLabelList,
      getLabels: getLabels,
      updateLabel: updateLabel,
      createLabel: createLabel
    };
  });
})();
