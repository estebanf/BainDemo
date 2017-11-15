'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;
exports.show = show;
exports.upsert = upsert;
exports.create = create;

var _faClient = require('../../components/faClient');

var _faClient2 = _interopRequireDefault(_faClient);

var _projectFile = require('./projectFile.model');

var _projectFile2 = _interopRequireDefault(_projectFile);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getFiles(cb) {
  var query = {
    q: '*',
    limit: 0,
    rows: 1000,
    fl: 'score,id,lastModified,fileName,fileSize,NE_SSN,NE_PERSON'
  };
  (0, _faClient2.default)(query, cb);
}
// Gets a list of Things
function index(req, res) {
  _faClient2.default.getFacets(function (response, body) {
    res.status(200).send(body);
  });
}

function show(req, res) {
  _faClient2.default.getFiles(req.params.id, function (response, body) {
    var files = _lodash2.default.map(JSON.parse(body).docs, function (value) {
      var item = { docId: value.docId };
      _lodash2.default.each(value.fields, function (obj) {
        var field = {};
        field[obj.name] = obj.value;
        item = _lodash2.default.merge(item, field);
      });
      item.fullPath = '/' + item.folder.join('/') + '/' + item.fileName;
      if (item.text_NePos) {
        item.text_NePos = JSON.parse(item.text_NePos);
      }
      item.sensitive = false;
      if (item.NE_SSN) {
        item.NE_SSN = _lodash2.default.uniq(item.NE_SSN);
        item.sensitive = true;
      } else {
        if (item.text_NePos) {
          var ssnPos = _lodash2.default.filter(item.text_NePos, function (o) {
            return o.type == "NE_SSN";
          });
          if (ssnPos && ssnPos.lenght > 0) {
            console.log(ssnPos);
            item.NE_SSN = _lodash2.default.map(ssnPos.values, function (o) {
              return o.gloss;
            });
            item.sensitive = true;
          }
        }
      }
      return item;
    });
    var ids = _lodash2.default.map(files, function (obj) {
      return obj.docId;
    });
    _projectFile2.default.find().where('cs_uid').in(ids).exec(function (err, projectFiles) {
      if (err) {
        console.log(err);
      } else {
        _lodash2.default.each(files, function (obj) {
          var projectFileMatch = _lodash2.default.find(projectFiles, function (o) {
            return o.cs_uid == obj.docId;
          });
          if (!projectFileMatch) {
            projectFileMatch = { cs_uid: obj.docId, keep: false };
            _projectFile2.default.create(projectFileMatch, function (err, entity) {
              if (err) {
                console.log(err);
              }
            });
          }
          obj = _lodash2.default.merge(obj, { cs_uid: projectFileMatch.docId, keep: projectFileMatch.keep });
        });
        res.status(200).send(files);
      }
    });
  });
}

function upsert(req, res) {
  _projectFile2.default.findOne().where('cs_uid').equals(req.params.id).exec(function (err, entity) {
    if (err) {
      console.log('err');
    } else {
      entity.keep = req.body.keep;
      entity.save(function (err, obj) {
        res.status(200).send(obj);
      });
    }
  });
}

function create(req, res) {
  var moveFiles = _lodash2.default.chain(req.body.files).filter(function (o) {
    return o.keep == true;
  }).map(function (o) {
    return o.docId;
  }).value();
  var delFiles = _lodash2.default.chain(req.body.files).filter(function (o) {
    return o.keep == false;
  }).map(function (o) {
    return o.docId;
  }).value();
  var command = {
    project: req.body.project,
    moveFiles: moveFiles,
    delFiles: delFiles
  };
  _faClient2.default.archive(command, function (response, body) {
    res.status(200).send(command);
  });
}
//# sourceMappingURL=faClient.controller.js.map
