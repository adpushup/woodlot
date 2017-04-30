// Woodlot initialisation module

'use strict';

var generateLog = require('./logGenerator'),
	logToStream = require('./fileStreamHandler'),
	fireMiddlewareEvents = require('./events').fireMiddlewareEvents,
    getLogFormat = require('./utils').getLogFormat,
    getFormatSpacing = require('./utils').getFormatSpacing,
    stringifyLog = require('./utils').stringifyLog,
    getFormatSeparator = require('./utils').getFormatSeparator,
    colorizeStdoutFormat = require('./utils').colorizeStdoutFormat;

// Function to write log entry to stdout
function logToStdOut(log, format, spacing, config) {
    var outputStream = process.stdout; // Set standard output stream
    
    if(format === 'json') {
        var colorizedLog = colorizeStdoutFormat(stringifyLog(log, format, spacing) + getFormatSeparator(config), getLogFormat(config));
        outputStream.write(colorizedLog);
    } else {
        outputStream.write(colorizeStdoutFormat(stringifyLog(log, format, spacing), getLogFormat(config)));
    }
};

// Function to initialise Woodlot middleware
function woodlotInit(req, res, next, config) {
    var startTime = +new Date(); // Get request start time

    // Listen to response 'finish' event and generate log + fire log events
    res.on('finish', function () {
        var log = generateLog(req, res, startTime, config),
            format = getLogFormat(config),
            spacing = getFormatSpacing(config);

        // Write to specified file streams
        logToStream(stringifyLog(log, format, spacing), config);

        // Write request log to stdout if option is present
        config.logToConsole ? logToStdOut(log, format, spacing, config) : null; 

        // Fire Woodlot events
        fireMiddlewareEvents(res, log);
    });

    next();
};

module.exports = woodlotInit;



