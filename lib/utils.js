// Woodlot utility library

var DEFAULT_JSON_SPACING = '\t';

// Function to get log format based on Woodlot config setup
function getLogFormat(options) {
	if(options.format && options.format.type) {
		return options.format.type.toUpperCase();
	}
	return 'JSON';
};

// Function to get JSON format spacing value 
function getFormatSpacing(options) {
	var format = getLogFormat(options);

	// Get format spacing only for JSON type
	if(format === 'JSON') {
		if(options.format && options.format.spacing) {
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

module.exports = {
	getLogFormat: getLogFormat,
	getFormatSpacing: getFormatSpacing,
	stringifyLog: stringifyLog
};