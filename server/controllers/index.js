/* jshint node: true */
/* jshint esnext: true */
"use strict";
const express = require("express"),
    router = express.Router()

/**
 * @swagger
 * tags:
 * - name: "Get todays weather"
 *   description: "endpoint for checking today is prime day or not (only dat part of date) and returns forecast if day is prime no"
 */
router.use("/api/weather", require("./weather"));

module.exports = router;
