// Woodlot custom logging module

var foregroundYellow = require('./stdoutColors').foregroundYellow,
	underlineText = require('./stdoutColors').underlineText;

var customLogger = {
	config: function(config) {
		if(!config || !config.streams) {
	        console.log(foregroundYellow('Woodlot warning: Please provide at least one valid file stream to start logging. More info here - ' + underlineText('https://github.com/adpushup/woodlot')));
	        return;
	    } else {
	    	config.logToConsole = ('stdOut' in config) ? config.stdOut : true;
	    }
	},
	log: function(message) {

	}
};

module.exports = customLogger;