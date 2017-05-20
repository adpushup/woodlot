var parser 			= require('ua-parser-js');
var maxmind 		= require('maxmind');
var countryLookup 	= null;

function getPlatformInfo(us){
	var finalJson = {}
	try {
		var ua = parser(params.userAgent);
		var result = ua.getResult();
		finalJson.browser = result.browser.name;
		finalJson.browserVersion = result.browser.version;
		finalJson.os = result.os.name;
		finalJson.osVersion = result.os.name;
	} catch (e) { }
	return finalJson;
}

function getCountry(ip){
	var country = null;
	try {
		if (!countryLookup) {
			/*This is sync operation and can stall application if db file is large, 
			so open file only if user have asked for county analytics*/
			countryLookup = maxmind.openSync('../maxmindDb/GeoLite2-Country.mmdb');
		}
		country = countryLookup.get(params.ip)
	} catch (error) {}
	return country;
}

function generateUserAnalytics(config, params) {
	var finalJson = {};

	if (config.platform && params.userAgent && params.userAgent !== '-') {
		finalJson = getPlatformInfo(params.userAgent)
	}

	if (config.country && params.ip) {
		finalJson.country = getCountry(params.ip);
	}

	return finalJson;
}

module.exports = generateUserAnalytics;

