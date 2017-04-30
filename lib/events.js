// Woodlot events module

'use strict';

var events = require('events'),
	woodlotEvents = new events.EventEmitter,
	EVENTS = require('./constants').EVENTS;

// Woodlot middleware events trigger
function fireMiddlewareEvents(res, log) {
	// Emit log event
	woodlotEvents.emit(EVENTS.LOG, log); 

	// Emit 'statusCode' event. More info on HTTP status codes here - http://www.restapitutorial.com/httpstatuscodes.html
    woodlotEvents.emit(res.statusCode, log); 

   	if(res.statusCode >= 400) {
   		// Emit 'error' event whenever a client/server error occurs. 
   		woodlotEvents.emit(EVENTS.ERR, log);
    }
};

function fireCustomLoggerEvent(event, log) {
	woodlotEvents.emit(event, log);
};

module.exports = {
	woodlotEvents: woodlotEvents,
	fireMiddlewareEvents: fireMiddlewareEvents
};

