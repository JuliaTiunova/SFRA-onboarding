"use strict";

function getExpirationDaysLeft(expirationDate) {
    var today = new Date();
    var daysLeft = expirationDate - today.getTime();
    daysLeft = Math.floor(daysLeft / 1000 / 60 / 60 / 24);
    return daysLeft;
}

module.exports = {
    getExpirationDaysLeft: getExpirationDaysLeft,
};
