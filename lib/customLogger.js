// Woodlot custom logging module

var foregroundYellow = require('./stdoutColors').foregroundYellow,
	underlineText = require('./stdoutColors').underlineText,
	logToStream = require('./fileStreamHandler'),
	stringifyLog = require('./utils').stringifyLog,
	DEFAULT_JSON_SPACING = require('./constants').DEFAULT_JSON_SPACING,
	generateCLFTimestamp = require('./utils').generateCLFTimestamp,
	customLoggerConfig = null;


var customLogger = {
	config: function(config) {
		if(!config || !config.streams) {
	        console.log(foregroundYellow('Woodlot warning: Please provide at least one valid file stream to start logging. More info here - ' + underlineText('https://github.com/adpushup/woodlot')));
	        return;
	    } else {
	    	config.logToConsole = ('stdOut' in config) ? config.stdOut : true;
	    	customLoggerConfig = config;
	    }
	},
	log: function(message) {
		var config = customLoggerConfig
			log = {
				timeStamp: generateCLFTimestamp(new Date()),
				message: message
			}

		// Write to specified file streams
        logToStream(stringifyLog(log, 'json', DEFAULT_JSON_SPACING), config);

		// Write request log to stdout if option is present
        config.logToConsole ? console.log(stringifyLog(log, 'json', DEFAULT_JSON_SPACING, config)) : null; 
	}
};

module.exports = customLogger;