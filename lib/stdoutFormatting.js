// Module to format stdout output

'use strict';

module.exports = {
	foregroundGreen: function(text) {
		return '\x1b[32m' + text + '\x1b[0m'; // ANSI color code to set foreground to green
	},
	foregroundBlue: function(text) {
		return '\x1b[34m' + text + '\x1b[0m'; // ANSI color code to set foreground to blue
	},
	foregroundYellow: function(text) {
		return '\x1b[33m' + text + '\x1b[0m'; // ANSI color code to set foreground to yellow
	},
	foregroundRed: function(text) {
		return '\x1b[31m' + text + '\x1b[0m'; // ANSI color code to set foreground to red
	},
	underlineText: function(text) {
		return '\x1b[4m' + text + '\x1b[0m';
	}
};