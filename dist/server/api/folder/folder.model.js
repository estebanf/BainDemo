'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _folder = require('./folder.events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FolderSchema = new _mongoose2.default.Schema({
  name: String,
  path: String
});

(0, _folder.registerEvents)(FolderSchema);
exports.default = _mongoose2.default.model('Folder', FolderSchema);
//# sourceMappingURL=folder.model.js.map
