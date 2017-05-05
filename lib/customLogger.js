// Woodlot custom logging module

'use strict';

var stdoutFormatting        =   require('./stdoutFormatting');
var fileStreamHandler       =   require('./fileStreamHandler');
var utils                   =   require('./utils');
var fireCustomLoggerEvent   =   require('./events').fireCustomLoggerEvent;
var LEVELS                  =   require('./constants').LEVELS;
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
    // Set standard output stream
    var outputStream = process.stdout; 

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

         // Set default level to 'info'
        config.level = level ? level : 'info';

        var format = utils.getLogFormat(config),
            log = generateCustomLog(format, message, config),
            spacing = utils.getFormatSpacing(config),
            outputStream = process.stdout;

        // Fire woodlot custom logger events
        fireCustomLoggerEvent(level, log);

        // Write to specified file streams
        format === 'text' ? fileStreamHandler(log, config) : fileStreamHandler(utils.stringifyLog(log, format, spacing), config);

        // Write request log to stdout if option is present
        config.logToConsole ? logToStdOut(log, format, spacing, config) : null;
    }
};

// Custom logger main module
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
    // Custom logging utility level functions - receives a message and logs it out with specified level
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
