"use strict";
const moment = require('moment');

function isPrimeDay(date) {
    var dateObj = moment.unix(date);
    var day = new Date(dateObj).getDate();
    return isPrimeNumber(day);
}

function isPrimeNumber(number) {
    if (number === 1) {
        return false;
    }

    if (number === 2) {
        return true;
    }

    for (var i = 2; i < number; i++) {
        if (number % i === 0) {
            return false;
        }
    }
    return true;
}

module.exports.isPrimeNumber = isPrimeNumber;
module.exports.isPrimeDay = isPrimeDay;