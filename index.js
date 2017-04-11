// Woodlot logging middleware

'use strict';

var woodlotEvents = require('./lib/events').woodlotEvents,
    woodlotInit = require('./lib/initialiser');

// Woodlot entry
function woodlot(options) {
    if(!options || !options.streams) {
        console.log('Please provide a valid stream value for the logger to start logging.');
        return function(req, res, next) { 
            next(); 
        }
    }

    var routeWhitelist = options.routeWhitelist;
    
    options.logToConsole = ('stdOut' in options) ? options.stdOut : true;
    options.logHeaders = ('headers' in options) ? options.headers : true;
    
    return function(req, res, next) {

        // Create log entry for all valid routes present in 'routeWhitelist' option
        if(typeof routeWhitelist === 'object' && routeWhitelist.length) {
            var validLogRoute = null;

            for(var i = 0; i < routeWhitelist.length; i ++) {
                validLogRoute = req.url.indexOf(routeWhitelist[i]) !== -1;   
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
    middlewareLogger: woodlot,
    events: woodlotEvents
};

