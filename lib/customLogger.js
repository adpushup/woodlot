// Woodlot custom logging module

'use strict';

var foregroundYellow = require('./stdoutColors').foregroundYellow,
    underlineText = require('./stdoutColors').underlineText,
    logToStream = require('./fileStreamHandler'),
    stringifyLog = require('./utils').stringifyLog,
    DEFAULT_JSON_SPACING = require('./constants').DEFAULT_JSON_SPACING,
    DEFAULT_SEPARATOR = require('./constants').DEFAULT_SEPARATOR,
    generateCLFTimestamp = require('./utils').generateCLFTimestamp,
    getLogFormat = require('./utils').getLogFormat,
    getFormatSpacing = require('./utils').getFormatSpacing,
    getFormatSeparator = require('./utils').getFormatSeparator,
    LEVELS = require('./constants').LEVELS,
    colorizeStdoutFormat = require('./utils').colorizeStdoutFormat,
    fireCustomLoggerEvent = require('./events').fireCustomLoggerEvent,
    EVENTS = require('./constants').EVENTS,
    customLoggerConfig = null;

// Function to log config warning to stdout
function logConfigWarning() {
    var logHead = foregroundYellow('woodlot[warning]: '),
        url = underlineText('https://github.com/adpushup/woodlot');

    process.stdout.write(logHead + 'Please provide at least one valid file stream to start logging. More info here - ' + url + '\n');
    return;
};

// Function to generate custom log based on format
function generateCustomLog(format, message, config) {
    var level = config.level;

    switch (format) {
        case 'text':
            return level.toUpperCase() + ' [' + generateCLFTimestamp(new Date()) + ']: ' + '"' + message + '"';

        case 'json':
        default:

            return {
                timeStamp: generateCLFTimestamp(new Date()),
                message: message,
                level: level.toUpperCase()
            };
    }
};

// Function to write log entry to stdout
function logToStdOut(log, format, spacing, config) {
    var outputStream = process.stdout; // Set standard output stream

    if (format === 'json') {
        var stringifiedLog = stringifyLog(log, format, spacing),
            colorizedLog = colorizeStdoutFormat(stringifiedLog, 'customLevelJSON');

        outputStream.write(colorizedLog + getFormatSeparator(config));
    } else {
        var colorizedLog = colorizeStdoutFormat(log, 'text')
        outputStream.write(colorizedLog + getFormatSeparator(config));
    }
};

// Custom level log utility 
function customLevelLog(level, message) {
    if (!customLoggerConfig) {
        logConfigWarning();
    } else {
        var config = customLoggerConfig;
        config.level = level ? level : 'info'; // Set default level to 'info'

        var format = getLogFormat(config),
            log = generateCustomLog(format, message, config),
            spacing = getFormatSpacing(config),
            outputStream = process.stdout; // Set standard output stream

        // Write to specified file streams
        format === 'text' ? logToStream(log, config) : logToStream(stringifyLog(log, format, spacing), config);

        // Write request log to stdout if option is present
        config.logToConsole ? logToStdOut(log, format, spacing, config) : null;
    }
};

// Custom logger module setup
var customLogger = {
    // Function to set custom logger config
    config: function(config) {
        if (!config || !config.streams) {
            logConfigWarning();
        } else {
            config.logToConsole = ('stdout' in config) ? config.stdout : true;

            customLoggerConfig = config;
        }
    },
    // Custom logging utility function levels - receives a message and logs it out with specified level
    info: function(message) {
        fireCustomLoggerEvent(LEVELS.INFO, {
            level: LEVELS.INFO,
            message: message
        });

        customLevelLog(LEVELS.INFO, message);
    },
    debug: function(message) {
        fireCustomLoggerEvent(LEVELS.DEBUG, {
            level: LEVELS.DEBUG,
            message: message
        });

        customLevelLog(LEVELS.DEBUG, message);
    },
    warn: function(message) {
        fireCustomLoggerEvent(LEVELS.WARN, {
            level: LEVELS.WARN,
            message: message
        });

        customLevelLog(LEVELS.WARN, message);
    },
    error: function(message) {
        fireCustomLoggerEvent(EVENTS.CUSTOM_ERR, {
            level: LEVELS.ERROR,
            message: message
        });

        customLevelLog(LEVELS.ERROR, message);
    }
};

module.exports = customLogger;
