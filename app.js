/* jshint node: true */
/* jshint esnext: true */
'use strict';

const express = require('express'),
    app = express(),
    fs = require('fs'),
    device = require('express-device'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    winston = require('winston'),
    moment = require('moment'),
    path = require('path'),
    swaggerJSDoc = require('swagger-jsdoc'),
    httpProtocol =  require("http"),
    envFile = require('dotenv').config(),
    swaggerUi = require('swagger-ui-express'),
    mongoose = require("./server/DAL/mongoose");

global._ = require('underscore');
//globally set the express-joi  variable
global.expressJoi = require('./server/utils/joiValidation');

/**
* Globally define the application config variables
**/
global.config = require('./config/');

/**
 * Create the directory for writing the logs
**/
let logFolder = global.config.logs.logFolder;
if (!fs.existsSync(logFolder)) {
    try {
        fs.mkdirSync(logFolder);
    } catch(e) {
        throw new Error(`Error creating log folder ${logFolder} - ${JSON.stringify(e)}`);
    }
}

/**
* Specify a single subnet for trusted proxy. 127.0.0.1/8, ::1/128
**/
app.set('trust proxy', 'loopback');

/**
 * CORS middleware
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
let allowCrossDomain = function (req, res, next) {
    var allowOrigin = "*";
    res.header("Access-Control-Allow-Origin", allowOrigin);
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authentication, x-access-token, x-auth-header, x-refresh-token, authorization, clientid, clientsecret");
    res.header("Access-Control-Expose-Headers", "x-auth-header, x-refresh-token");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    if (req.method === 'OPTIONS') {
        res.status(200).send();
    } else {
        next();
    }
};
app.use(allowCrossDomain);

/**
* Decrease the size of the response body to increase the speed of a web application.
**/
app.use(compression());

/**
* Capture the device information of the user.
**/
app.use(device.capture({parseUserAgent:true}));

/**
* Create access log stream.
**/
const accessLogStream = fs.createWriteStream(`${logFolder}/access.log`, {flags : 'a'});

/**
* Initialize access log writer.
**/
global.logger = new winston.Logger({
    transports : [
        new (winston.transports.File)({
            timestamp : () => {
                return moment(new Date()).utc().format("YYYY-MM-DDTHH:mm:ss");
            },
            formatter : (options) => {
                return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' + (undefined !== options.message ? options.message : '') + (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
            },
            level: 'verbose',
            colorize: true,
            name : 'access-file',
            stream : accessLogStream,
            handleExceptions : false,
            humanReadableUnhandledException : false,
            json : false
        }),
        new (winston.transports.Console)()
    ],
    exitOnError : false
});

/**
* Create server log stream.
**/
const serverLogStream = fs.createWriteStream(`${logFolder}/server.log`, {flags : 'a'});

/**
* Initialize post data parsing.
**/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/**
* Initialize the router.
**/
app.use(require('./server/controllers/'));

/**
 * Swagger-UI Integration Section
 */

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition: global.config.swaggerDefinition,
  // path to the API docs
  apis: ['./server/controllers/*.js','./server/controllers/weather/*.js']
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

  //swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
* Default handler for invalid API endpoint.
**/
app.all('*', (req, res) => {
    res.status(500).json({"responseCode" : global.config.default_error_code, "responseDesc" : global.config.default_error_message});
});

/**
* Default handler for uncaught exception error.
**/
app.use((err, req, res, next) => {
    global.logger.error("UUID=" + res._headers['x-request-id'], "UncaughtException is encountered", "Error=" + err, "Stacktrace=" + err.stack);
    let response = {"responseCode" : global.config.default_error_code, "responseDesc" : global.config.service_down_message};
    if (res.headersSent) {
        clearInterval(req.timer);
        response = JSON.stringify(response);
        response = response.replace(/^({)/, "");
        return res.end('",' + response);
    }
    res.status(500).json(response);
});

// move this to helper files
mongoose.connect((err) => {
    if(err)
        global.logger.error('error connecting to mongodb', err);
    else
        global.logger.info('connected to mongo');
    
  });
  
// Create http web server.
let httpServer = httpProtocol.createServer(app);

/**
* Server start port.
**/
httpServer.listen(global.config.appPort, () => {
    global.logger.info(`Server started on ${global.config.environmentName.charAt(0).toUpperCase() + global.config.environmentName.slice(1)} server started at port ${global.config.appPort}`);
});
