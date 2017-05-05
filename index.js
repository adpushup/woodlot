// Woodlot logging library main module

'use strict';

var woodlotEvents       =   require('./lib/events').woodlotEvents;
var woodlotInit         =   require('./lib/initialiser');
var stdoutFormatting    =   require('./lib/stdoutFormatting');
var customLogger        =   require('./lib/customLogger');
var routeHandler        =   require('./lib/routeHandler');
var utils               =   require('./lib/utils');

// Woodlot logger middleware entry
function middlewareLogger(config) {

    // Check logger config for requried params
    if(!config || !config.streams) {
        // Log config warning to stdout 
        utils.logConfigWarning();

        // And continue express middleware chain execution
        return function(req, res, next) { 
            next(); 
        }
    }

    // Sort config params for middleware execution
    var routeWhitelist = (config.routes && config.routes.whitelist) ? config.routes.whitelist : [];
    config.logToConsole = ('stdout' in config) ? config.stdout : true;
    config.logHeaders = (config.format && 'options' in config.format && 'headers' in config.format.options) ? config.format.options.headers : true;
    
    // Standard middleware function signature 
    return function(req, res, next) {

        // Create log entry for all valid routes present in 'routes.whitelist' option in config
        if(typeof routeWhitelist === 'object' && routeWhitelist.length) {
            // Check current route for whitelist settings
            if(routeHandler(routeWhitelist, config, req)) {
                return woodlotInit(req, res, next, config);
            } else {
                next();
            }
        }
        // Else create log entry for all routes
        else {
            return woodlotInit(req, res, next, config);
        }
    }
};

module.exports = {
    middlewareLogger: middlewareLogger,
    events: woodlotEvents,
    customLogger: customLogger
};

