// Route handler module for woodlot

'use strict';

function routeHandler(routeWhitelist, config, req) {
    var foundRoute = null;

    if (routeWhitelist && config.routes.strictChecking) {
        foundRoute = routeWhitelist.find(function(route) {
            return route === req.url.replace(/\/$/, '');
        });
    } else {
        for (var i = 0; i < routeWhitelist.length; i++) {
            foundRoute = req.url.indexOf(routeWhitelist[i]) !== -1;
            break;
        }
    }

    return foundRoute ? foundRoute : null;
};

module.exports = routeHandler;