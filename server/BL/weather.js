"use strict";

const request = require("request-promise");

function getWeather (params){
    let options = {
        method: 'GET',
        uri: process.env.WEATHER_API,
        qs: addQueryString(params),
        rejectUnauthorized: false
    };
    return request(options);
}

function addQueryString(params) {
    var qs = {};
    qs.q = `${params.city},${params.country}`;
    qs.appid = params.key;
    return qs;
}


module.exports.getWeather = getWeather;
module.exports.addQS = addQueryString;
