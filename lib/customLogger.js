// Woodlot custom logging module

'use strict';

var stdoutFormatting        =   require('./stdoutFormatting');
var logToStream             =   require('./fileStreamHandler');
var utils                   =   require('./utils');
var LEVELS                  =   require('./constants').LEVELS;
var fireCustomLoggerEvent   =   require('./events').fireCustomLoggerEvent;
var customLoggerConfig      =   null;

// Function to generate custom log based on format
function generateCustomLog(format, message, config) {
    var level = config.level;

    switch (format) {
        case 'text':
            return level.toUpperCase() + ' [' + utils.generateCLFTimestamp(new Date()) + ']: ' + '"' + message + '"';

        case 'json':
        default:

            return {
                timeStamp: utils.generateCLFTimestamp(new Date()),
                message: message,
                level: level.toUpperCase()
            };
    }
};

// Function to write log entry to stdout
function logToStdOut(log, format, spacing, config) {
    var outputStream = process.stdout; // Set standard output stream

    if (format === 'json') {
        var stringifiedLog = utils.stringifyLog(log, format, spacing),
            colorizedLog = utils.colorizeStdoutFormat(stringifiedLog, 'customLevelJSON');

        outputStream.write(colorizedLog + utils.getFormatSeparator(config));
    } else {
        var colorizedLog = utils.colorizeStdoutFormat(log, 'text')
        outputStream.write(colorizedLog + utils.getFormatSeparator(config));
    }
};

// Custom level log utility 
function customLevelLog(level, message) {
    if (!customLoggerConfig) {
        utils.logConfigWarning();
    } else {
        var config = customLoggerConfig;
        config.level = level ? level : 'info'; // Set default level to 'info'

        var format = utils.getLogFormat(config),
            log = generateCustomLog(format, message, config),
            spacing = utils.getFormatSpacing(config),
            outputStream = process.stdout; // Set standard output stream

        // Fire woodlot custom logger events
        fireCustomLoggerEvent(level, log);

        // Write to specified file streams
        format === 'text' ? logToStream(log, config) : logToStream(utils.stringifyLog(log, format, spacing), config);

        // Write request log to stdout if option is present
        config.logToConsole ? logToStdOut(log, format, spacing, config) : null;
    }
};

// Custom logger module setup
var customLogger = {
    // Function to set custom logger config
    config: function(config) {
        if (!config || !config.streams) {
            utils.logConfigWarning();
        } else {
            config.logToConsole = ('stdout' in config) ? config.stdout : true;

            customLoggerConfig = config;
        }
    },
    // Custom logging utility function levels - receives a message and logs it out with specified level
    info: function(message) {
        customLevelLog(LEVELS.INFO, message);
    },
    debug: function(message) {
        customLevelLog(LEVELS.DEBUG, message);
    },
    warn: function(message) {
        customLevelLog(LEVELS.WARN, message);
    },
    err: function(message) {
        customLevelLog(LEVELS.ERR, message);
    }
};

module.exports = customLogger;
