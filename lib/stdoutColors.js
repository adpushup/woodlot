// Module to colorize stdout output
// More info about ANSI color codes - http://pueblo.sourceforge.net/doc/manual/ansi_color_codes.html

// Color code to set foreground to green
function foregroundGreen(text) {
	return '\x1b[32m' + text + '\x1b[0m';
};

// Color code to set foreground to blue
function foregroundBlue(text) {
	return '\x1b[34m' + text + '\x1b[0m'; 
};

// Color code to set foreground to yellow
function foregroundYellow(text) {
	return '\x1b[33m' + text + '\x1b[0m'; 
};

// Color code to set foreground to red
function foregroundRed(text) {
	return '\x1b[31m' + text + '\x1b[0m';
};

// Function to create underlined set
function underlineText(text) {
	return '\x1b[4m' + text + '\x1b[0m';
};

module.exports = {
	foregroundGreen: foregroundGreen,
	foregroundBlue: foregroundBlue,
	foregroundYellow: foregroundYellow,
	foregroundRed: foregroundRed,
	underlineText: underlineText
};