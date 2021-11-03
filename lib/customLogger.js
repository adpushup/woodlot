// Woodlot custom logging module

'use strict';

var stdoutFormatting = require('./stdoutFormatting');
var fileStreamHandler = require('./fileStreamHandler');
var utils = require('./utils');
var fireCustomLoggerEvent = require('./events').fireCustomLoggerEvent;
var LEVELS = require('./constants').LEVELS;

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
    var outputStream = process.stdout,
        isCompactLog = utils.isCompactLog(config);

    if (format === 'json') {
        var stringifiedLog = utils.stringifyLog(log, format, spacing),
            colorizedLog = stdoutFormatting.colorizeStdoutFormat(stringifiedLog, 'customLevelJSON', isCompactLog);

        outputStream.write(colorizedLog + utils.getFormatSeparator(config));
    } else {
        var colorizedLog = stdoutFormatting.colorizeStdoutFormat(log, 'text', isCompactLog)
        outputStream.write(colorizedLog + utils.getFormatSeparator(config));
    }
};

// Custom level log utility
function customLevelLog(config, level, message) {
    if (!config) {
        utils.logConfigWarning();
    } else {
        // Set default level to 'info'
        config.level = level ? level : 'info';

        var format = utils.getLogFormat(config),
            log = generateCustomLog(format, message, config),
            spacing = utils.getFormatSpacing(config),
            outputStream = process.stdout;

        // Fire woodlot custom logger events
        fireCustomLoggerEvent(level, log);

        // Write to specified file streams
        if (config.streams.length) format === 'text' ? fileStreamHandler(log, config) : fileStreamHandler(utils.stringifyLog(log, format, spacing), config);

        // Write request log to stdout if option is present
        config.logToConsole ? logToStdOut(log, format, spacing, config) : null;
    }
};

// Custom logger main module
function customLogger(config) {
    config.logToConsole = ('stdout' in config) ? config.stdout : true;

    if (!config || !config.streams || !config.streams.length) {
      if (!config.logToConsole) {
          return utils.logConfigWarning();
      }
      config.streams ??= [];
    }

    this.config = config;

    // Custom logging utility level functions - receives a message and logs it out with specified level
    this.info = function (message) {
        customLevelLog(this.config, LEVELS.INFO, message);
    };
    this.debug = function (message) {
        customLevelLog(this.config, LEVELS.DEBUG, message);
    };
    this.warn = function (message) {
        customLevelLog(this.config, LEVELS.WARN, message);
    };
    this.err = function (message) {
        customLevelLog(this.config, LEVELS.ERR, message);
    };
};

module.exports = customLogger;
