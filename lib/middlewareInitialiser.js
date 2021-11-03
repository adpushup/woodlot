// Woodlot middleware initialisation module

'use strict';

var generateLog = require('./logGenerator');
var logToStream = require('./fileStreamHandler');
var fireMiddlewareEvents = require('./events').fireMiddlewareEvents;
var utils = require('./utils');
var stdoutFormatting = require('./stdoutFormatting');

// Function to write log entry to stdout
function logToStdOut(log, format, spacing, config) {
    // Set standard output stream
    var outputStream = process.stdout,
        stringifiedLog = utils.stringifyLog(log, format, spacing),
        formatSeparator = utils.getFormatSeparator(config),
        format = utils.getLogFormat(config),
        isCompactLog = utils.isCompactLog(config);

    if (format === 'json') {
        var colorizedLog = stdoutFormatting.colorizeStdoutFormat(stringifiedLog + formatSeparator, format, isCompactLog);
        outputStream.write(colorizedLog);
    } else {
        outputStream.write(stdoutFormatting.colorizeStdoutFormat(stringifiedLog, format, isCompactLog));
    }
};

// Function to initialise woodlot middleware logger
function middlewareInitialiser(req, res, next, config) {
    // Get request start time
    var startTime = +new Date();

    // Listen to response object's 'finish' event and generate log + fire log events
    res.on('finish', function () {
        var log = generateLog(req, res, startTime, config),
            format = utils.getLogFormat(config),
            spacing = utils.getFormatSpacing(config);

        // Write to specified file streams
        if (config.streams.length) logToStream(utils.stringifyLog(log, format, spacing), config);

        // Write request log to stdout if option is present
        config.logToConsole ? logToStdOut(log, format, spacing, config) : null;

        // Fire woodlot middleware events
        fireMiddlewareEvents(res, log);
    });

    next();
};

module.exports = middlewareInitialiser;



