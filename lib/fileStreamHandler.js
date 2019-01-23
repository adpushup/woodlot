// Woodlot file stream handler module

'use strict';

var fs = require('fs');
var Promise = require('bluebird');
var mkdirp = require('mkdirp');
var promisify = Promise.promisify;
var path = require('path');
var utils = require('./utils');

// Function to create file output directory if not present
function createLogFileDir(log, config, dir) {
    var filePath = path.dirname(dir),
        mkdirpPromise = promisify(mkdirp);

    // Create log file and append log to file
    return mkdirpPromise(filePath)
        .then(function () {
            logToStream(log, config);
        })
        .catch(function (err) {
            process.stdout.write('Woodlot: Error occurred while writing log entry to file stream. \n' + err);
        })
};

// Add generated log to specified file streams
function logToStream(log, config) {
    // Promisify required methods and create file stream promises
    var appendFilePromise = promisify(fs.appendFile),
        filePromises = config.streams.map(function (stream) {
            var logEntry = (utils.getLogFormat(config) === 'json' || utils.getLogFormat(config) === 'text') ? (log + utils.getFormatSeparator(config)) : log;
            return appendFilePromise(stream, logEntry, 'utf8');
        });

    // Append generated log to all file streams
    return Promise.all(filePromises)
        .then(function (data) { })
        .catch(function (err) {
            if (err.code === 'ENOENT') {
                // Create log directory if its not present
                createLogFileDir(log, config, err.cause.path);
            } else {
                process.stdout.write('Woodlot: Error occurred while writing log entry to file stream. \n' + err);
            }
        });
};

module.exports = logToStream;
