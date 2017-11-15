'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _environment = require('../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//DELETE:  http://fa.everteam.us:8080/storage/api/files/delete?ids=%5B%22bXZXMDNLRllTS2svZTBhOTNjMDQtYzM5YS00Njg5LTllNDYtNGU2NDg0OWVjMzcx%22%5D
//MOVE: http://fa.everteam.us:8080/storage/api/files/move?ids=bXZXMDNLRllTS2svNThmZDkxYmEtNGExYi00ZDQ0LWIxNjAtNmY0ZjlhZGRlZDVi&targetId=dzlZdTNsSXJGUXMv
//REPOS: http://fa.everteam.us:8080/storage/api/repositories

// require('request-debug')(request);
var accessToken = "";
function getToken() {
  (0, _request2.default)({
    url: _environment2.default.faClient.url + '/uaa/oauth/token',
    method: 'POST',
    headers: {
      'Authorization': 'Basic d2ViX2FwcDo=', // + new Buffer(config.fa.username + ':' + config.fa.password).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
      grant_type: 'password',
      username: _environment2.default.faClient.login,
      password: _environment2.default.faClient.password
    }
  }, function (err, response, body) {
    if (err) {
      console.log(err);
    }
    accessToken = JSON.parse(body).access_token;
  });
}
if (accessToken == "") {
  getToken();
}
function getOptions(url, queryString) {
  var opts = {
    url: _environment2.default.faClient.url + url,
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  };
  if (queryString) {
    _lodash2.default.merge(opts, {
      qs: queryString
    });
  }
  return opts;
}

function callApi(opts, cb) {
  (0, _request2.default)(opts, function (err, response, body) {
    if (err) {
      console.log(err);
    } else {
      if (cb) {
        cb(response, body);
      }
    }
  });
}

exports.default = {
  query: function query(queryString, cb) {
    callApi(getOptions('/analytics/api/collections/fs-docs/select', queryString), cb);
  },
  getFiles: function getFiles(project, cb) {
    var opts = getOptions('/analytics/api/collections/fs-docs/select', {
      q: 'folderPath: (\"00-' + project + '\")',
      limit: '100',
      rows: '100',
      start: '0',
      fl: 'cs_uid,fileName,fileType,folder,lastModified,lastAccessed,NE_SSN,doc_type,text_NePos'
    });
    callApi(opts, cb);
  },
  getFacets: function getFacets(cb) {
    var opts = getOptions('/analytics/api/collections/fs-docs/select', {
      q: '*',
      limit: '10',
      rows: '20',
      start: '0',
      fl: 'score,cs_uid',
      facets: 'fields.folderPath,fields.cs_lang,fields.category,fields.company,fields.creator,fields.fileType,fields.msg_from,ranges.lastAccessed,ranges.lastModified,ranges.fileSize,fields.fileName,fields.NE_PERSON,fields.NE_ORGANISATION,fields.NE_LOCATION'
    });
    callApi(opts, cb);
  },
  addFolder: function addFolder(name, cb) {
    var opts = _lodash2.default.merge(getOptions('/analytics/api/collections/fs-docs/ds/fs'), {
      json: {
        id: '',
        ext: '*',
        desc: name,
        path: _environment2.default.faClient.location + '/' + name
      }
    });
    callApi(opts, function (response, body) {
      var optsArchive = _lodash2.default.merge(getOptions('/analytics/api/collections/fs-docs/ds/fs'), {
        json: {
          id: '',
          ext: '*',
          desc: 'Archive' + name,
          path: _environment2.default.faClient.archive + '/' + name
        }
      });
      callApi(optsArchive, function (response, body) {
        if (cb) {
          cb(response, body);
        }
      });
    });
  },
  archive: function archive(command, cb) {
    var opts = _lodash2.default.merge(getOptions('/storage/api/repositories'), {
      method: 'GET'
    });
    callApi(opts, function (response, body) {
      var data = JSON.parse(body);
      // var source = _.find(data,function(o) { return o.name == command.project })
      var target = _lodash2.default.find(data, function (o) {
        return o.name == 'Archive' + command.project;
      });
      var optsDelete = getOptions('/storage/api/files/delete?ids=["' + command.delFiles.join('\",\"') + '"]');
      callApi(optsDelete, function (response, body) {
        // console.log(response);
        var optsMove = getOptions('/storage/api/files/move', {
          ids: command.moveFiles.join(','),
          targetId: target.id
        });
        callApi(optsMove, function (response, body) {
          if (cb) {
            cb();
          }
        });
      });
    });
  }
};
//# sourceMappingURL=faClient.js.map
