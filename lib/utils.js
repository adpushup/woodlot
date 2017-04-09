// Woodlot utility library

var DEFAULT_JSON_SPACING = require('./constants').DEFAULT_JSON_SPACING;

// Function to get log format based on Woodlot config setup
function getLogFormat(options) {
	if(options.format && options.format.type) {
		return options.format.type.toLowerCase();
	}
	return 'json';
};

// Function to get JSON format spacing value 
function getFormatSpacing(options) {
	var format = getLogFormat(options);

	// Get format spacing only for JSON type
	if(format === 'json') {
		if(options.format && ('spacing' in options.format)) {
			var spacing = parseInt(options.format.spacing, 10);

			if(isNaN(spacing)) {
				return options.format.spacing;
			}

			return spacing;
		}
		return  DEFAULT_JSON_SPACING;
	}
	return null;
};

// Function that stringifies a log based on its format
function stringifyLog(log, format, spacing) {
	spacing = spacing || DEFAULT_JSON_SPACING;

	switch(format.toLowerCase()) {
		case 'combined':
		case 'common':

			return log;

		case 'json':
		default:

			return JSON.stringify(log, null, spacing);
	}
};

// Function to pad single digits with preceding 0
function padSingleDigit(num) {
	var str = String(num)

  	return (str.length === 1 ? '0' : '') + str;
};

// Function to generate apache CLF timestamp
function generateCLFTimestamp(timeStamp) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        date = new Date(timeStamp);

    return padSingleDigit(date.getUTCDate()) + '/' + months[date.getUTCMonth()] + '/' + date.getUTCFullYear() + ':' + padSingleDigit(date.getUTCHours()) + ':' + padSingleDigit(date.getUTCMinutes()) + ':' + padSingleDigit(date.getUTCSeconds()) + ' +0000';
};

module.exports = {
	getLogFormat: getLogFormat,
	getFormatSpacing: getFormatSpacing,
	stringifyLog: stringifyLog,
	padSingleDigit: padSingleDigit,
	generateCLFTimestamp: generateCLFTimestamp
};

