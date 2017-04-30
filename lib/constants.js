// Woodlot constants

'use strict';

module.exports = {
	EVENTS: {
		LOG: 'reqLog',
		ERR: 'reqErr',
		CUSTOM_ERR: 'err'
	},
	LEVELS: {
		INFO: 'info',
		DEBUG: 'debug',
		WARN: 'warn',
		ERROR: 'error'
	},
	DEFAULT_JSON_SPACING: '\t',
	DEFAULT_SEPARATOR: '\n',
	STDOUT_FORMAT_REGEX: {
		APACHE: / \d{3}/,
		JSON: /"statusCode": \d{3}/,
		TEXT: /[^\s]+/,
		CUSTOMLEVELJSON: /"level": "(.*?)"/
	}
};