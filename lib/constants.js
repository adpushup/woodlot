// Woodlot constants

'use strict';

module.exports = {
	EVENTS: {
		LOG: 'reqLog',
		ERR: 'reqErr'
	},
	LEVELS: {
		INFO: 'info',
		DEBUG: 'debug',
		WARN: 'warn',
		ERR: 'err'
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