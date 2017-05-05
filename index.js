// Woodlot logging library main module

'use strict';

// Include required modules
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
        utils.logConfigWarning();
        return function(req, res, next) { 
            next(); 
        }
    }

    var routeWhitelist = (config.routes && config.routes.whitelist) ? config.routes.whitelist : [];
    
    config.logToConsole = ('stdout' in config) ? config.stdout : true;
    config.logHeaders = (config.format && 'options' in config.format && 'headers' in config.format.options) ? config.format.options.headers : true;
    
    return function(req, res, next) {

        // Create log entry for all valid routes present in 'routeWhitelist' option
        if(typeof routeWhitelist === 'object' && routeWhitelist.length) {
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

