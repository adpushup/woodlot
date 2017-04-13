// Module to colorize stdout output logs

// Function to colorize request status code
function colorizeStatusCode(statusCode) {
	if(statusCode >= 200 && statusCode < 300) {

		return '\x1b[32m' + statusCode + '\x1b[0m'; // // Color code to set foreground to green
	
	} else if(statusCode >= 300 && statusCode < 400) {

		return '\x1b[34m' + statusCode + '\x1b[0m'; // // Color code to set foreground to blue

	} else if(statusCode >= 400 && statusCode < 500) {
		
		return '\x1b[33m' + statusCode + '\x1b[0m'; // Color code to set foreground to yellow
	
	} else {
		
		return '\x1b[31m' + statusCode + '\x1b[0m'; // Color code to set foreground to red
	
	}

	// More info about ANSI color codes - http://pueblo.sourceforge.net/doc/manual/ansi_color_codes.html
};

module.exports = colorizeStatusCode;