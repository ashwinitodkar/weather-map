/**
 * Module dependencies
 */
const Mongoose = require("mongoose"),
  Types = Mongoose.Schema.Types;

/**
 * user inputs of weather api requests
 */

const modelName = "weatheraudit";

/**
 * @swagger
 * definitions:
 *   weatheraudit:
 *     properties:
 *       date:
 *         type: string
 *         required: true
 *       isPrime:
 *         type: boolean
 *         required: true
 *       city:
 *         type: string
 *       country:
 *         type: string
 *       weatherApiJson:
 *         type: string
 *       apiKey:
 *         type: string
 */

const weatherSchema = new Mongoose.Schema({
    date:{
      type: Types.Date,
        required: true
    },
    prime:{
      type: Types.Boolean,
        required: true
    },
    city:{
      type: Types.String,
    },
    country:{
      type: Types.String,
    },
    weatherApiJson: {
      type : Types.Mixed
    },
    apiKey:{
      type: Types.String,
    }
  },
  { timestamps: true }
);


module.exports = Mongoose.model(modelName, weatherSchema);