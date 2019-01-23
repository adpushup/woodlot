// Woodlot events module

'use strict';

var events = require('events');
var woodlotEvents = new events.EventEmitter;
var EVENTS = require('./constants').EVENTS;

// Woodlot middleware logger events trigger
function fireMiddlewareEvents(res, log) {
	// Emit 'reqLog' event
	woodlotEvents.emit(EVENTS.LOG, log);

	// Emit ':statusCode' event. More info on HTTP status codes here - http://www.restapitutorial.com/httpstatuscodes.html
	woodlotEvents.emit(res.statusCode, log);

	if (res.statusCode >= 400) {
		// Emit 'reqErr' event whenever a client/server error occurs. 
		woodlotEvents.emit(EVENTS.ERR, log);
	}
};

// Woodlot custom logger events trigger
function fireCustomLoggerEvent(event, log) {
	// Emit 'level' event
	woodlotEvents.emit(event, log);
};

module.exports = {
	woodlotEvents: woodlotEvents,
	fireMiddlewareEvents: fireMiddlewareEvents,
	fireCustomLoggerEvent: fireCustomLoggerEvent
};

