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
    customLoggerConfig = null;

// Function to log config warning to stdout
function logConfigWarning() {
    console.log(foregroundYellow('Woodlot warning: Please provide at least one valid file stream to start logging. More info here - ' + underlineText('https://github.com/adpushup/woodlot')));
    return;
};

// Custom logger module setup
var customLogger = {
    // Function to set custom logger config
    config: function(config) {
        if (!config || !config.streams) {
            logConfigWarning();
        } else {
            config.logToConsole = ('stdOut' in config) ? config.stdOut : true;
            config.format = {
                type: 'json',
                options: {
                    spacing: config.spacing ? config.spacing : DEFAULT_JSON_SPACING,
                    separator: config.separator ? config.separator : DEFAULT_SEPARATOR
                }
            };

            customLoggerConfig = config;
        }
    },
    // Custom logging utility function that receives a message and logs it out
    log: function(message) {
        if (!customLoggerConfig) {
            logConfigWarning();
        } else {
            var config = customLoggerConfig,
                log = {
                    timeStamp: generateCLFTimestamp(new Date()),
                    message: message
                },
                format = getLogFormat(config),
                spacing = getFormatSpacing(config),
                outputStream = process.stdout; // Set standard output stream

            // Write to specified file streams
            logToStream(stringifyLog(log, format, spacing), config);

            // Write request log to stdout if option is present
            config.logToConsole ? outputStream.write(stringifyLog(log, format, spacing) + getFormatSeparator(config)) : null;
        }
    }
};

module.exports = customLogger;
