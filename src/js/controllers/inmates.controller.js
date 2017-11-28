angular.module('inmateManager').controller('inmatesCtrl', function (InmateService, $state, $scope) {
    var self = this;

    self.searchChargesType = 'lessThan';
    self.searchBailType = 'lessThan';
    self.searchDateReleasedType = 'lessThan';
    self.searchDateChargedType = 'lessThan';
    self.searchNumCharges;
    self.searchBailAmount;
    self.searchDateReleased;
    self.searchDateCharged;
    self.totalBailAmount = 0;
    self.sortType = 'name';
    self.sortDirection = false;

    self.addInmate = function (inmate) {
        InmateService.addInmateToManager(inmate).done(function (response) {
            console.log(response);
        });
    };

    self.searchCharges = function (inmate) {
        if (!self.searchNumCharges) {
            return true;
        } else if (self.searchChargesType == 'exact' && inmate.charges.length == self.searchNumCharges) {
            return true;
        } else if (self.searchChargesType == 'lessThan' && inmate.charges.length <= self.searchNumCharges) {
            return true;
        } else if (self.searchChargesType == 'greaterThan' && inmate.charges.length >= self.searchNumCharges) {
            return true;
        }
        return false;
    };

    self.searchTotalBail = function (inmate) {
        if (!self.searchBailAmount) {
            return true;
        } else if (self.searchBailType == 'exact' && inmate.totalBailAmount == self.searchBailAmount) {
            return true;
        } else if (self.searchBailType == 'lessThan' && inmate.totalBailAmount <= self.searchBailAmount) {
            return true;
        } else if (self.searchBailType == 'greaterThan' && inmate.totalBailAmount >= self.searchBailAmount) {
            return true;
        }
        return false;
    };

    self.searchDatesReleased = function (inmate) {
        if (!self.searchDateReleased) {
            return true;
        } else if (self.searchDateReleasedType === 'exact' && new Date(inmate.dateReleased).getTime() === new Date(self.searchDateReleased).getTime()) {
            return true;
        } else if (self.searchDateReleasedType === 'lessThan' && new Date(inmate.dateReleased).getTime() <= new Date(self.searchDateReleased).getTime()) {
            return true;
        } else if (self.searchDateReleasedType === 'greaterThan' && new Date(inmate.dateReleased).getTime() >= new Date(self.searchDateReleased).getTime()) {
            return true;
        }
        return false;
    };

    self.searchDatesCharged = function (inmate) {
        if (!self.searchDateCharged) {
            return true;
        } else if (self.searchDateChargedType === 'exact' && new Date(inmate.dateCharged).getTime() === new Date(self.searchDateCharged).getTime()) {
            return true;
        } else if (self.searchDateChargedType === 'lessThan' && new Date(inmate.dateCharged).getTime() <= new Date(self.searchDateCharged).getTime()) {
            return true;
        } else if (self.searchDateChargedType === 'greaterThan' && new Date(inmate.dateCharged).getTime() >= new Date(self.searchDateCharged).getTime()) {
            return true;
        }
        return false;
    };

    self.getStats = function () {
        self.totalBailAmount = 0;
        self.filterResults.forEach(function (inmate) {
            self.totalBailAmount += inmate.totalBailAmount;
        });
    };

    self.sort = function (type) {
        if (self.sortType == type) {
            self.sortDirection = !self.sortDirection;
        } else {
            self.sortType = type;
        }
    };

    self.customSort = function (item1, item2) {
        if (self.sortType === 'dateReleased' || self.sortType === 'dateCharged') {
            if (item1.value === '[incarcerated]') {
                return -1;
            } else if (item2.value === '[incarcerated]') {
                return 1;
            }
            if (new Date(item1.value).getTime() < new Date(item2.value).getTime()) {
                return -1;
            } else if (new Date(item1.value).getTime() > new Date(item2.value).getTime()) {
                return 1;
            }
        } else {
            if (item1.value < item2.value) {
                return -1;
            } else if (item1.value > item2.value) {
                return 1;
            }
        }
    }

    self.getInmatesCSV = function () {
        window.open("https://inmatesearch.herokuapp.com/api/nc/durham/inmates/download");
    };

});