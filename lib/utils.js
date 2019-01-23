// Woodlot utility library

'use strict';

var constants = require('./constants');
var stdoutFormatting = require('./stdoutFormatting');

module.exports = {
    // Function to get log format based on woodlot config
    getLogFormat: function (config) {
        if (config.format && config.format.type) {
            return config.format.type.toLowerCase();
        }
        return 'json';
    },
    // Function to return "compact" option value
    isCompactLog: function (config) {
        if (config.format && config.format.options && config.format.options.compact) {
            return config.format.options.compact;
        }
        return false;
    },
    // Function to get JSON format spacing value
    getFormatSpacing: function (config) {
        var format = this.getLogFormat(config);

        // Get format spacing only for JSON type
        if (format === 'json') {
            if (config.format && config.format.options) {
                var options = config.format.options;

                if (options.compact) {
                    return null;
                }

                if ('spacing' in options) {
                    var spacing = options.spacing;
                    var parsedSpacing = parseInt(spacing, 10);

                    if (isNaN(parsedSpacing)) {
                        return spacing || constants.DEFAULT_JSON_SPACING;
                    }

                    return parsedSpacing;
                }
            }
            return constants.DEFAULT_JSON_SPACING;
        }
        return null;
    },
    // Function that stringifies a log based on its format
    stringifyLog: function (log, format, spacing) {
        switch (format.toLowerCase()) {
            case 'combined':
            case 'common':

                return log;

            case 'json':
            default:

                return JSON.stringify(log, null, spacing);
        }
    },
    // Function to pad single digits with preceding 0
    padSingleDigit: function (num) {
        var str = String(num)

        return (str.length === 1 ? '0' : '') + str;
    },
    // Function to generate apache CLF timestamp
    generateCLFTimestamp: function (timeStamp) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            date = new Date(timeStamp);

        return this.padSingleDigit(date.getUTCDate()) + '/' + months[date.getUTCMonth()] + '/' + date.getUTCFullYear() + ':' + this.padSingleDigit(date.getUTCHours()) + ':' + this.padSingleDigit(date.getUTCMinutes()) + ':' + this.padSingleDigit(date.getUTCSeconds()) + ' +0000';
    },
    // Function to get format separator value
    getFormatSeparator: function (config) {
        return (config.format && config.format.options && 'separator' in config.format.options) ? config.format.options.separator : constants.DEFAULT_SEPARATOR;
    },
    // Function to check request/response params
    checkParam: function (param) {
        return param ? param : null;
    },
    // Function to get valid ip string
    isIpStringValid: function (ip) {
        return ip.includes('::') ? false : true;
    },
    // Function to fetch country name from details
    fetchCountry: function (countryData) {
        var name = null,
            isoCode = null;

        if (countryData) {
            try {
                name = countryData.country.names.en;
                isoCode = countryData.country.iso_code;
            } catch (e) { }

            return {
                name: name,
                isoCode: isoCode
            };
        }
    },
    // Function to get real ip of client
    getRealIp: function (req) {
        var ip = req.ip,
            headers = req.headers;

        if (headers['x-forwarded-for']) {
            ip = headers['x-forwarded-for'];
        } else if (headers['x-real-ip']) {
            ip = headers['x-real-ip'];
        }

        return ip;
    },
    // Function to log config warning to stdout
    logConfigWarning: function () {
        var logHead = stdoutFormatting.foregroundYellow('woodlot[warning]: '),
            url = stdoutFormatting.underlineText('https://github.com/adpushup/woodlot');

        process.stdout.write(logHead + 'Please provide at least one valid file stream to start logging. More info here - ' + url + '\n');
        return;
    }
};
