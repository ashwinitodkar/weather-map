"use strict";
var maths = require('../../BL/maths'),
    moment = require('moment'),
    weatherDAL = require("../../DAL/weather"),
    weatherBL = require('../../BL/weather');

function getTodaysWeather(params){
    return new Promise((resolve, reject) => {
        params.city = params.city || "Pune"; //set default city
        params.country = params.country || "ind";

        weatherBL.getWeather(params)
        .then(data=>{
            if(data){
                try{
                    var apiReponse = JSON.parse(data), result = {};
                    logger.info('current date', new Date(moment.unix(apiReponse.dt)));
                    if(apiReponse.dt){
                        if(maths.isPrimeDay(apiReponse.dt)){
                            result.prime = true;
                            result.data = apiReponse;
                        }else{
                            result.prime = false;
                            result.data = ` ${new Date(moment.unix(apiReponse.dt))} is not prime date so no data`
                        }
                    }
                    weatherDAL.saveAudit({
                        date: new Date(moment.unix(apiReponse.dt)),
                        prime: result.prime,
                        city: params.city,
                        country: params.country,
                        weatherApiJson: apiReponse,
                        apiKey: params.key
                    }).then(data=>{
                        logger.info('saved data in audit');
                    }).catch(err=>{
                        logger.error('failed adding data in audit');
                    });
                    resolve(result);
                }catch(e){
                    reject(e);
                }
            }
        }).catch(err=>{
            reject(err);
        });
    });
}

module.exports.getTodaysWeather = getTodaysWeather;
