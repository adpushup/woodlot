// Woodlot user analytics module

'use strict';

var parser = require('ua-parser-js');
var maxmind = require('maxmind');
var utils = require('./utils');
var path = require('path');
var countryLookup = null;

// Function to get platform info based on user agent
function getPlatformInfo(params) {
	var finalJson = {};
	try {
		var ua = parser(params.userAgent);

		finalJson.browser = ua.browser.name;
		finalJson.browserVersion = ua.browser.version;
		finalJson.os = ua.os.name;
		finalJson.osVersion = ua.os.version;
	} catch (e) { }

	return finalJson;
};

// Function to get location based on ip
function getCountry(params) {
	var countryData = null;
	try {
		if (!countryLookup) {
			/*This is sync operation and can stall application if db file is large, 
			so open file only if user have asked for county analytics*/
      countryLookup = new maxmind.Reader(fs.readFileSync('../maxmindDb/GeoLite2-Country.mmdb'));
		}
		countryData = countryLookup.get(params.ip);
	} catch (e) { }

	return utils.fetchCountry(countryData);
};

// Function to generate user analytics based on config
function generateUserAnalytics(config, params) {
	var finalJson = {};

	if (config.platform && params.userAgent && params.userAgent !== '-') {
		finalJson = getPlatformInfo(params);
	}

	if (config.country && params.ip && utils.isIpStringValid(params.ip)) {
		finalJson.country = getCountry(params);
	}

	return finalJson;
};

module.exports = generateUserAnalytics;

