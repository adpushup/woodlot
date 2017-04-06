// Woodlot events module

'use strict';

var events = require('events'),
	woodlotEvents = new events.EventEmitter,
	LOG_EVENT = require('./constants').EVENTS.LOG,
	ERR_EVENT = require('./constants').EVENTS.ERR;

// Woodlot events trigger
function fireWoodlotEvents(streamJSONLog, res) {
	// Emit log event with JSON log output
	woodlotEvents.emit(LOG_EVENT, streamJSONLog); 

	// Emit 'statusCode' event with JSON log output 
    woodlotEvents.emit(res.statusCode, streamJSONLog); 

   	if(res.statusCode >= 400) {
   		// Emit 'error' event with JSON log output whenever a client/server error occurs. More info on HTTP status codes here - http://www.restapitutorial.com/httpstatuscodes.html
   		woodlotEvents.emit(ERR_EVENT, streamJSONLog);
    }
};

module.exports = {
	woodlotEvents: woodlotEvents,
	fireWoodlotEvents: fireWoodlotEvents
};

