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

    options.headers ? (params.headers = req.headers) : null;
    options.cookies ? (params.cookies = req.cookies) : null;

    return params;
};

// Function to generate log entry for stdout and specified file streams
function generateLog(req, res, startTime, options) {
    var params = getLogParameters(req, res, startTime, options),
        format = getLogFormat(options),
        contentLength = params.contentLength ? params.contentLength : '-',
        referrer = params.referrer ? '"' + params.referrer + '"' : '-';

    // Generate log entry based on type
    switch(format.toLowerCase()) {
        case 'combined':
            /*  
                Format example : 127.0.0.1 [Thu Apr 06 2017 00:05:11 GMT+0530 (IST)] "GET /user HTTP1.1" 200 4 "http://www.example.com/" "Mozilla/4.08 [en] (Win98)" 
                More info : http://httpd.apache.org/docs/current/logs.html#combined
            */

            return params.ip + " [" + params.timeStamp + "] \"" + params.method + " " + params.url + " HTTP" + params.httpVersion + "\" " + params.statusCode + " " + contentLength + " " + referrer + " \"" + params.userAgent + "\"\n";

        case 'common':
            /*  
                Format example : 127.0.0.1 [Thu Apr 06 2017 00:05:11 GMT+0530 (IST)] "GET /user HTTP1.1" 200 4
                More info : http://httpd.apache.org/docs/current/logs.html#common
            */

            return params.ip + " [" + params.timeStamp + "] \"" + params.method + " " + params.url + " HTTP" + params.httpVersion + "\" " + params.statusCode + " " + contentLength + "\n";
            
        case 'json':
        default:

            return params;
    }
};

module.exports = generateLog;

