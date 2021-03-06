import request from 'request';
import config from '../config/environment';
import _ from 'lodash';
//DELETE:  http://fa.everteam.us:8080/storage/api/files/delete?ids=%5B%22bXZXMDNLRllTS2svZTBhOTNjMDQtYzM5YS00Njg5LTllNDYtNGU2NDg0OWVjMzcx%22%5D
//MOVE: http://fa.everteam.us:8080/storage/api/files/move?ids=bXZXMDNLRllTS2svNThmZDkxYmEtNGExYi00ZDQ0LWIxNjAtNmY0ZjlhZGRlZDVi&targetId=dzlZdTNsSXJGUXMv
//REPOS: http://fa.everteam.us:8080/storage/api/repositories

// require('request-debug')(request);
var accessToken = ""
function getToken() {
  request({
    	url: config.faClient.url + '/uaa/oauth/token',
    	method: 'POST',
    	headers: {
        'Authorization': 'Basic d2ViX2FwcDo=',// + new Buffer(config.fa.username + ':' + config.fa.password).toString('base64'),
    		'Content-Type': 'application/x-www-form-urlencoded'
    	},
      form:{
        grant_type: 'password',
        username: config.faClient.login,
        password: config.faClient.password
    	}
    },function(err,response,body){
      if(err){
        console.log(err);
      }
      accessToken = JSON.parse(body).access_token
    })

}
if(accessToken == ""){
  getToken();
}
function getOptions(url,queryString){
  var opts = {
    url: config.faClient.url + url,
    method:'POST',
    headers:{
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }
  if(queryString){
    _.merge(opts,{
      qs:queryString
    })
  }
  return opts;
}

function callApi(opts,cb){
  request(opts,function(err,response,body){
    if(err){
      console.log(err);
    }
    else{
      if(cb){
        cb(response,body)
      }
    }
  })
}

export default {
  query: function(queryString,cb){
    callApi(getOptions('/analytics/api/collections/fs-docs/select',queryString),cb);
  },
  getFiles:function(project,cb){
    var opts = getOptions('/analytics/api/collections/fs-docs/select',
    {
      q: 'folderPath: (\"00-'+ project +'\")',
      limit: '100',
      rows:'100',
      start:'0',
      fl: 'cs_uid,fileName,fileType,folder,lastModified,lastAccessed,NE_SSN,doc_type,text_NePos'
    });
    callApi(opts,cb);
  },
  getFacets:function(cb){
    var opts = getOptions('/analytics/api/collections/fs-docs/select',
    {
      q:'*',
      limit:'10',
      rows:'20',
      start:'0',
      fl:'score,cs_uid',
      facets:'fields.folderPath,fields.cs_lang,fields.category,fields.company,fields.creator,fields.fileType,fields.msg_from,ranges.lastAccessed,ranges.lastModified,ranges.fileSize,fields.fileName,fields.NE_PERSON,fields.NE_ORGANISATION,fields.NE_LOCATION'
    });
    callApi(opts,cb);

  },
  addFolder: function(name,cb){
    var opts = _.merge(getOptions('/analytics/api/collections/fs-docs/ds/fs'),{
      json:{
        id:'',
        ext:'*',
        desc:name,
        path: config.faClient.location + '/' + name
      }
    });
    callApi(opts,function(response, body){
      var optsArchive = _.merge(getOptions('/analytics/api/collections/fs-docs/ds/fs'),{
        json:{
          id:'',
          ext:'*',
          desc: 'Archive' + name,
          path: config.faClient.archive + '/' + name
        }
      });
      callApi(optsArchive,function(response,body){
        if(cb) { cb(response,body) }
      });
    });
  },
  archive: function(command,cb){
    var opts = _.merge(getOptions('/storage/api/repositories'),{
      method: 'GET'
    });
    callApi(opts,function(response,body){
      var data = JSON.parse(body);
      var target = _.find(data,function(o) { return o.name == 'Archive' + command.project })
      _.each(command.delFiles,function(o){
        console.log('/storage/api/files/delete?ids=["' + o + '"]')
        var optsDelete= getOptions('/storage/api/files/delete?ids=["' + o + '"]');
        callApi(optsDelete,function(response,body){
          console.log(body);
        });
      })
      var optsMove = getOptions('/storage/api/files/move',{
        ids:command.moveFiles.join(','),
        targetId: target.id
      })
      callApi(optsMove,function(response,body){
          if(cb) { cb (); }
      })

      // var optsDelete= getOptions('/storage/api/files/delete?ids=["' + command.delFiles.join('\",\"') + '"]');
      // callApi(optsDelete,function(response,body){
      //   // console.log(response);
      // })

    })
  }
}
