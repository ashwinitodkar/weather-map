exports.validatePrimeDay = {
    key: global.expressJoi.Joi.string().required(),
    country: global.expressJoi.Joi.string(),
    city: global.expressJoi.Joi.string()
}