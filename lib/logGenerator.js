// Woodlot log generator module 

'use strict';

var getLogFormat = require('./utils').getLogFormat;

// Get required parameters from request and response object to generate log entry
function getLogParameters(req, res, startTime, options) {
    var params = { 
        responseTime: +new Date() - startTime + 'ms', 
        method: req.method, 
        url : req.originalUrl, 
        ip: req.ip, 
        body: req.body, 
        params: req.params, 
        query: req.query, 
        httpVersion: req.httpVersion, 
        statusCode: res.statusCode, 
        timeStamp: new Date(), 
        contentType: res.get('Content-Type'), 
        contentLength: res.get('Content-Length') ? res.get('Content-Length') : null, 
        userAgent: req.get('user-agent') ? req.get('user-agent') : '-', 
        referrer: req.get('referer') ? req.get('referer') : null
    };

    options.logHeaders ? (params.headers = req.headers) : null;
    options.logCookies ? (params.cookies = req.cookies) : null;

    return params;
};

// Function to generate log entry for stdout and specified file streams
function generateLog(req, res, startTime, options) {
    var params = getLogParameters(req, res, startTime, options),
        format = getLogFormat(options);

    // Generate log entry based on type
    switch(format) {
        case 'APACHE-COMBINED':
            var contentLength = params.contentLength ? params.contentLength : '-',
                referrer = params.referrer ? '"' + params.referrer + '"' : '-';

            return params.ip + " [" + params.timeStamp + "] \"" + params.method + " " + params.url + " HTTP" + params.httpVersion + "\" " + params.statusCode + " " + contentLength + " " + referrer + " \"" + params.userAgent + "\"\n";
            
        case 'JSON':
        default:
            return params;
    }
};

module.exports = generateLog;

