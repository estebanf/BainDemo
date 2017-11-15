'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import {registerEvents} from './folder.events';

var ProjectFileSchema = new _mongoose2.default.Schema({
  cs_uid: String,
  keep: Boolean
});

// registerEvents(FolderSchema);
exports.default = _mongoose2.default.model('ProjectFile', ProjectFileSchema);
//# sourceMappingURL=projectFile.model.js.map
