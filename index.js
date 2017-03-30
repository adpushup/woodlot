// Woodlot logging middleware

'use strict';

var woodlotEvents = require('./lib/events').woodlotEvents,
    woodlotInit = require('./lib/initialiser');

// Woodlot entry
function woodlot(options) {
    if(!options || !options.stream) {
        console.log('Please provide a valid stream value for the logger to start logging.');
        return function(req, res, next) { 
            next(); 
        }
    }

    var stream = options.stream,
        logToStdOut = options.stdOut,
        logFor = options.logFor,
        logToConsole = ('stdOut' in options) ? logToStdOut : true;
    
    options.logToConsole = logToConsole;

    return function(req, res, next) {

        // Create log entry for all valid log routes present in 'logFor' options
        if(typeof logFor === 'object' && logFor.length) {
            var validLogRoute = null;

            for(var i = 0; i < logFor.length; i ++) {
                validLogRoute = req.url.indexOf(logFor[i]) !== -1;   
            }

            if(validLogRoute) {
                return woodlotInit(req, res, next, options);
            } else {
                next();
            }
        }
        // Else create log entry for all routes
        else {
            return woodlotInit(req, res, next, options);
        }
    }
};

module.exports = {
    woodlot: woodlot,
    woodlotEvents: woodlotEvents
};

