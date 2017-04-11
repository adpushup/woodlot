// Woodlot initialisation module

'use strict';

var generateLog = require('./logGenerator'),
	logToStream = require('./fileStreamHandler'),
	fireWoodlotEvents = require('./events').fireWoodlotEvents,
    getLogFormat = require('./utils').getLogFormat,
    getFormatSpacing = require('./utils').getFormatSpacing,
    stringifyLog = require('./utils').stringifyLog;

// Function to initialise Woodlot with options
function woodlotInit(req, res, next, options) {
    var startTime = +new Date(), // Get request start time
        outputStream = process.stdout; // Set standard output stream

    // Listen to response 'finish' event and generate log + fire log events
    res.on('finish', function () {
        var log = generateLog(req, res, startTime, options),
            format = getLogFormat(options),
            spacing = getFormatSpacing(options);

        // Write to specified file streams
        logToStream(stringifyLog(log, format, spacing), options.streams);

        // Write request log to stdout if option is present
        options.logToConsole ? outputStream.write(stringifyLog(log, format, spacing)) : null; 

        // Fire Woodlot events
        fireWoodlotEvents(log, res);
    });

    next();
};

module.exports = woodlotInit;