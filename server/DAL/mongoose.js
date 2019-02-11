'use strict';

/**
 * Module dependencies.
 */
const mongoose = require('mongoose');


// Initialize Mongoose 172.16.27.143
module.exports.connect = function (callback) {
    mongoose.Promise = config.Promise
    let options = Object.assign({}, { useMongoClient: true });
    let mongoUri = buildConnectionString();
    mongoose.connect(mongoUri, options);
    mongoose.Promise = Promise;

    let db = mongoose.connection;
    db.on('error', function (error) {
        global.logger.error(`Error in mongo connection- ${error}`);
        callback(error);
    });

    db.on('connected', function () {
        return callback(null)
    });
};

module.exports.disconnect = function (cb) {
    mongoose.connection.db
        .close(function (err) {
            global.logger.info('Disconnected from MongoDB.');
        });
};

function buildConnectionString(){
    return `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}`;
  };