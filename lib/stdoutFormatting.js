// Woodlot module to format stdout output

'use strict';

var constants = require('./constants');

module.exports = {
	foregroundGreen: function (text) {
		return '\x1b[32m' + text + '\x1b[0m'; // ANSI color code to set foreground to green
	},
	foregroundBlue: function (text) {
		return '\x1b[34m' + text + '\x1b[0m'; // ANSI color code to set foreground to blue
	},
	foregroundYellow: function (text) {
		return '\x1b[33m' + text + '\x1b[0m'; // ANSI color code to set foreground to yellow
	},
	foregroundRed: function (text) {
		return '\x1b[31m' + text + '\x1b[0m'; // ANSI color code to set foreground to red
	},
	underlineText: function (text) {
		return '\x1b[4m' + text + '\x1b[0m'; // ANSI code to create underlined text
	},
	// Function to colorize request status code
	colorizeStatusCode: function (statusCode) {
		if (statusCode >= 200 && statusCode < 300) {
			return this.foregroundGreen(statusCode);
		} else if (statusCode >= 300 && statusCode < 400) {
			return this.foregroundBlue(statusCode);
		} else if (statusCode >= 400 && statusCode < 500) {
			return this.foregroundYellow(statusCode);
		} else {
			return this.foregroundRed(statusCode);
		}
	},
	// Function to colorize log level
	colorizeLogLevel: function (level) {
		switch (level.toLowerCase()) {
			case 'debug':
				return this.foregroundBlue(level);
			case 'warn':
				return this.foregroundYellow(level);
			case 'err':
				return this.foregroundRed(level);
			case 'info':
			default:
				return this.foregroundGreen(level);
		}
	},
	// Function to colorize log formats based on regex match
	colorizeStdoutFormat: function (log, format, compact) {
		switch (format.toLowerCase()) {
			case 'combined':
			case 'common':
				var statusCodeIndex = log.match(constants.STDOUT_FORMAT_REGEX.APACHE).index,
					statusCodeValue = log.substr(statusCodeIndex, 4),
					color = this.colorizeStatusCode(statusCodeValue);

				return log.replace(constants.STDOUT_FORMAT_REGEX.APACHE, color);

			case 'text':
				var logLevel = log.match(constants.STDOUT_FORMAT_REGEX.TEXT)[0],
					colorizedLog = log.replace(logLevel, this.colorizeLogLevel(logLevel));

				return colorizedLog;

			case 'customleveljson':
				var customLevelRegex = constants.STDOUT_FORMAT_REGEX.CUSTOMLEVELJSON,
					customLevelOffset = 10,
					customLevelTrim = 5,
					customLevelText = "level: " + '"';

				if (compact) {
					customLevelRegex = /"level":"(.*?)"/;
					customLevelOffset = 9;
					customLevelTrim = 4;
					customLevelText = "level:" + '"';
				}

				var levelIndex = log.match(customLevelRegex).index,
					colorizedLog = this.colorizeLogLevel(log.substr(levelIndex + customLevelOffset, customLevelTrim).trim().replace(/['"]+/g, ''));

				return log.replace(customLevelRegex, customLevelText + colorizedLog + '"');

			case 'json':
			default:
				var statusCodeRegex = constants.STDOUT_FORMAT_REGEX.JSON,
					statusRegexOffset = 14,
					statusCodeText = '"statusCode": ';

				if (compact) {
					statusCodeRegex = /"statusCode":\d{3}/;
					statusRegexOffset = 13;
					statusCodeText = '"statusCode":';
				}

				var statusCodeIndex = log.match(statusCodeRegex).index + statusRegexOffset,
					statusCodeValue = log.substr(statusCodeIndex, 3),
					color = this.colorizeStatusCode(statusCodeValue);

				return log.replace(statusCodeRegex, statusCodeText + color);
		}
	}
};