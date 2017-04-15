// File stream handler module for Woodlot

'use strict';

var fs = require('fs'),
    Promise = require('bluebird'),
    mkdirp = require('mkdirp'),
    promisify = Promise.promisify,
    path = require('path'),
    getLogFormat = require('./utils').getLogFormat,
    getFormatSeparator = require('./utils').getFormatSeparator;


// Function to create file output directory if not present
function createLogFileDir(log, config, dir) {
    var filePath = path.dirname(dir),
    	mkdirpPromise = promisify(mkdirp);

    return mkdirpPromise(filePath)
        .then(function() {
            logToStream(log, config);
        })
        .catch(function(err) {
            process.stdout.write('Woodlot: Error occurred while writing log entry to file stream. \n' + err);
        })
};

// Add generated log to specified file streams
function logToStream(log, config) {
    var appendFilePromise = promisify(fs.appendFile),
        filePromises = config.streams.map(function(stream) {
            var logEntry = (getLogFormat(config) === 'json' || getLogFormat(config) === 'text') ? (log + getFormatSeparator(config)) : log;
            return appendFilePromise(stream, logEntry, 'utf8');
        });

    return Promise.all(filePromises)
        .then(function(data) {})
        .catch(function(err) {
            if (err.code === 'ENOENT') {
                createLogFileDir(log, config, err.cause.path);
            } else {
                console.log(err);
                process.stdout.write('Woodlot: Error occurred while writing log entry to file stream. \n' + err);
            }
        });
};

module.exports = logToStream;
