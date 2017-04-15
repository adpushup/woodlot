// Woodlot custom logging module

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
    colorizeStdoutFormat = require('./utils').colorizeStdoutFormat,
    customLoggerConfig = null;

// Function to log config warning to stdout
function logConfigWarning() {
    var logHead = foregroundYellow('woodlot[warning]: '),
        url = underlineText('https://github.com/adpushup/woodlot');

    process.stdout.write(logHead + 'Please provide at least one valid file stream to start logging. More info here - ' + url);
    return;
};

// Function to generate custom log based on format
function generateCustomLog(format, message) {
    switch(format) {
        case 'text':
            return 'LOG['+generateCLFTimestamp(new Date())+']: '+ '"' + message + '"';

        case 'json':
        default:

            return {
                timeStamp: generateCLFTimestamp(new Date()),
                message: message
            };
    }
};

// Function to write log entry to stdout
function logToStdOut(log, format, spacing, config) {
    var outputStream = process.stdout; // Set standard output stream
    
    if(format === 'json') {
        var colorizedLog = stringifyLog(log, format, spacing) + getFormatSeparator(config);
        outputStream.write(colorizedLog);
    } else {
        outputStream.write(log + getFormatSeparator(config));
    }
};

// Custom logger module setup
var customLogger = {
    // Function to set custom logger config
    config: function(config) {
        if (!config || !config.streams) {
            logConfigWarning();
        } else {
            config.logToConsole = ('stdOut' in config) ? config.stdOut : true;

            customLoggerConfig = config;
        }
    },
    // Custom logging utility function that receives a message and logs it out
    log: function(message) {
        if (!customLoggerConfig) {
            logConfigWarning();
        } else {
            var config = customLoggerConfig,
                format = getLogFormat(config),
                log = generateCustomLog(format, message),
                spacing = getFormatSpacing(config),
                outputStream = process.stdout; // Set standard output stream

            // Write to specified file streams
            format === 'text' ? logToStream(log, config) : logToStream(stringifyLog(log, format, spacing), config);

            // Write request log to stdout if option is present
            config.logToConsole ? logToStdOut(log, format, spacing, config) : null;
        }
    }
};

module.exports = customLogger;
