/**
 * Folder model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEvents = undefined;

var _events = require('events');

var FolderEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
FolderEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Folder) {
  for (var e in events) {
    var event = events[e];
    Folder.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function (doc) {
    FolderEvents.emit(event + ':' + doc._id, doc);
    FolderEvents.emit(event, doc);
  };
}

exports.registerEvents = registerEvents;
exports.default = FolderEvents;
//# sourceMappingURL=folder.events.js.map
