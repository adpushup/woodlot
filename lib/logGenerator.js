// Woodlot log generator module 

'use strict';

var auth = require('basic-auth');
var utils = require('./utils');
var userAnalytics = require('./userAnalytics');


// Get required parameters from request and response object to generate log entry
function getLogParameters(req, res, startTime, config) {
    var ip = utils.getRealIp(req),
        params = {
            responseTime: +new Date() - startTime + 'ms',
            method: utils.checkParam(req.method),
            url: req.originalUrl ? req.originalUrl : (req.url ? req.url : null),
            ip: utils.checkParam(ip),
            body: utils.checkParam(req.body),
            params: utils.checkParam(req.params),
            query: utils.checkParam(req.query),
            httpVersion: utils.checkParam(req.httpVersion),
            statusCode: utils.checkParam(res.statusCode),
            timeStamp: utils.generateCLFTimestamp(new Date()),
            contentType: utils.checkParam(res.get('Content-Type')),
            contentLength: utils.checkParam(res.get('Content-Length')),
            userAgent: 'user-agent' in req.headers ? req.headers['user-agent'] : (req.get('user-agent') ? req.get('user-agent') : '-'),
            referrer: 'get' in req ? (req.get('referer') ? req.get('referer') : null) : null
        };

    if (config.userAnalytics) {
        params.userAnalytics = userAnalytics(config.userAnalytics, params);
    }

    if (utils.getLogFormat(config) == 'json') {
        // Add request headers to generated log
        config.logHeaders ? (params.headers = req.headers) : null;

        // Add request cookies to generated log if option is present
        (config.format && config.format.options && config.format.options.cookies) ? (params.cookies = req.cookies) : null;
    }

    return params;
};

// Function to generate log entry for stdout and specified file streams
function generateLog(req, res, startTime, config) {
    var params = getLogParameters(req, res, startTime, config),
        format = utils.getLogFormat(config),
        contentLength = params.contentLength ? params.contentLength : '-',
        referrer = params.referrer ? '"' + params.referrer + '"' : '"-"',
        clfTimeStamp = utils.generateCLFTimestamp(new Date()), // Generate CLF timestamp
        userId = auth(req) ? auth(req).name : '-'; // Parse basic request credentials

    // Define apache logging format base
    var apacheBaseFormat = params.ip + " - " + userId + " [" + clfTimeStamp + "] \"" + params.method + " " + params.url + " HTTP/" + params.httpVersion + "\" " + params.statusCode + " " + contentLength;

    // Generate log entry based on format type
    switch (format.toLowerCase()) {
        case 'combined':
            /*  
                Format example : 127.0.0.1 - john [Thu Apr 06 2017 00:05:11 GMT+0530 (IST)] "GET /user HTTP1.1" 200 4 "http://www.example.com/" "Mozilla/4.08 [en] (Win98)" 
                More info : http://httpd.apache.org/docs/current/logs.html#combined
            */

            return apacheBaseFormat + " " + referrer + " \"" + params.userAgent + "\"" + utils.getFormatSeparator(config);

        case 'common':
            /*  
                Format example : 127.0.0.1 - john [Thu Apr 06 2017 00:05:11 GMT+0530 (IST)] "GET /user HTTP1.1" 200 4
                More info : http://httpd.apache.org/docs/current/logs.html#common
            */

            return apacheBaseFormat + utils.getFormatSeparator(config);

        case 'json':
        default:

            return params;
    }
};

module.exports = generateLog;

