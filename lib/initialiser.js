// Woodlot initialisation module

'use strict';

var generateLog = require('./logGenerator'),
	logToStream = require('./fileStreamHandler'),
	fireWoodlotEvents = require('./events').fireWoodlotEvents,
    getLogFormat = require('./utils').getLogFormat,
    getFormatSpacing = require('./utils').getFormatSpacing,
    stringifyLog = require('./utils').stringifyLog;

// Function to initialise Woodlot middleware
function woodlotInit(req, res, next, config) {
    var startTime = +new Date(), // Get request start time
        outputStream = process.stdout; // Set standard output stream

    // Listen to response 'finish' event and generate log + fire log events
    res.on('finish', function () {
        var log = generateLog(req, res, startTime, config),
            format = getLogFormat(config),
            spacing = getFormatSpacing(config);

        // Write to specified file streams
        logToStream(stringifyLog(log, format, spacing), config.streams);

        // Write request log to stdout if option is present
        config.logToConsole ? outputStream.write(stringifyLog(log, format, spacing)) : null; 

        // Fire Woodlot events
        fireWoodlotEvents(log, res);
    });

    next();
};

module.exports = woodlotInit;