// Woodlot utility library

'use strict';

var DEFAULT_JSON_SPACING = require('./constants').DEFAULT_JSON_SPACING,
	DEFAULT_SEPARATOR = require('./constants').DEFAULT_SEPARATOR,
	foregroundGreen = require('./stdoutColors').foregroundGreen,
	foregroundBlue = require('./stdoutColors').foregroundBlue,
	foregroundYellow = require('./stdoutColors').foregroundYellow,
	foregroundRed = require('./stdoutColors').foregroundRed;

// Function to get log format based on Woodlot passed config
function getLogFormat(config) {
	if(config.format && config.format.type) {
		return config.format.type.toLowerCase();
	}
	return 'json';
};

// Function to get JSON format spacing value 
function getFormatSpacing(config) {
	var format = getLogFormat(config);

	// Get format spacing only for JSON type
	if(format === 'json') {
		if(config.format && config.format.options && ('spacing' in config.format.options)) {
			var spacing = parseInt(config.format.options.spacing, 10);

			if(isNaN(spacing)) {
				return config.format.options.spacing;
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

// Function to get format separator value
function getFormatSeparator(config) {
	return (config.format && config.format.options && 'separator' in config.format.options) ? config.format.options.separator : DEFAULT_SEPARATOR;
}

// Function to colorize request status code in stdout
function colorizeStatusCode(statusCode) {
	if(statusCode >= 200 && statusCode < 300) {

		return foregroundGreen(statusCode); 
	
	} else if(statusCode >= 300 && statusCode < 400) {

		return foregroundBlue(statusCode);

	} else if(statusCode >= 400 && statusCode < 500) {
		
		return foregroundYellow(statusCode); 
	
	} else {
		
		return foregroundRed(statusCode); 
	
	}
};

module.exports = {
	getLogFormat: getLogFormat,
	getFormatSpacing: getFormatSpacing,
	stringifyLog: stringifyLog,
	padSingleDigit: padSingleDigit,
	generateCLFTimestamp: generateCLFTimestamp,
	getFormatSeparator: getFormatSeparator,
	colorizeStatusCode: colorizeStatusCode
};

