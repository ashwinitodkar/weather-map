"use strict";
const weatherModel = require("../models/weather-schema");


module.exports.saveAudit = (data) => {
    let newDoc = new weatherModel(data);
    return newDoc.save();
}