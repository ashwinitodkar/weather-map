/* jshint node: true */
/* jshint esnext: true */
"use strict";
const express = require("express"),
    router = express.Router(),
    primeDay = require('./prime-day'),
    schema = require("../schema");

/**
 *  @swagger
 * /api/weather:
 *   get:
 *     tags:
 *       - weather
 *     description: weather
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: key
 *         description: weather api key
 *         in: query
 *         required: true
 *         type: string
 *       - name: city
 *         description: get weather of specific city
 *         in: query
 *         type: string
 *       - name: country
 *         description: country code of city e.g. for India - ind
 *         in: query
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully processed the request
 *       400:
 *         description: bad request
 */
router.get(
    "/",
    global.expressJoi.joiValidate(schema.validatePrimeDay),
    (req, res) => {
        logger.info('index api');
        primeDay.getTodaysWeather(req.query)
        .then(data=>{
            res.status(200).json(data);
        }).catch(err=>{
            logger.error(err);
            res.status(500).json({message: "Oops something went wrong!!"});
        })   
    }
);

module.exports = router;
