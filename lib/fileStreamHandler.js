'use strict';

// File stream handler module for Woodlot

var fs = require('fs'),
    Promise = require('bluebird'),
    mkdirp = require('mkdirp'),
    promisify = Promise.promisify,
    path = require('path');

// Function to create file output directory if not present
function createLogFileDir(log, streams, dir) {
    var filePath = path.dirname(dir),
    	mkdirpPromise = promisify(mkdirp);

    return mkdirpPromise(filePath)
        .then(function() {
            logToStream(log, streams);
        })
        .catch(function(err) {
            process.stdout.write('Woodlot: Error occurred while writing log entry to file stream. \n' + err);
        })
};

// Add generated log to specified file streams
function logToStream(log, streams) {
    var appendFilePromise = promisify(fs.appendFile),
        filePromises = streams.map(function(stream) {
            return appendFilePromise(stream, log, 'utf8');
        });

    return Promise.all(filePromises)
        .then(function(data) {})
        .catch(function(err) {
            if (err.code === 'ENOENT') {
                createLogFileDir(log, streams, err.cause.path);
            } else {
                process.stdout.write('Woodlot: Error occurred while writing log entry to file stream. \n' + err);
            }
        });
};

module.exports = logToStream;
