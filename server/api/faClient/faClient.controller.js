'use strict';
import faClient from '../../components/faClient';
import ProjectFile from './projectFile.model';

import _ from 'lodash';
function getFiles(cb){
  var query = {
    q:'*',
    limit:0,
    rows:1000,
    fl:'score,id,lastModified,fileName,fileSize,NE_SSN,NE_PERSON'
  }
  faClient(query,cb);
}
// Gets a list of Things
export function index(req, res) {
  faClient.getFacets(function(response,body){
    res.status(200).send(body);

  })
}

export function show(req,res){
  faClient.getFiles(req.params.id,function(response,body){
    var files = _.map(JSON.parse(body).docs,function(value){
      var item = { docId: value.docId };
      _.each(value.fields,function(obj){
        var field = {}
        field[obj.name] = obj.value;
        item = _.merge(item,field);
      });
      item.fullPath = '/' + item.folder.join('/') + '/' + item.fileName;
      return item;
    });
    var ids = _.map(files,function(obj){
      return obj.docId;
    });
    ProjectFile.find()
      .where('cs_uid').in(ids)
      .exec(function(err,projectFiles){
        if(err){
          console.log(err);
        }
        else{
          _.each(files,function(obj){
            var projectFileMatch = _.find(projectFiles, function(o) { return o.cs_uid == obj.docId });
            if(!projectFileMatch){
              projectFileMatch = { cs_uid: obj.docId, keep: false }
              ProjectFile.create(projectFileMatch,function(err,entity){
                if(err) { console.log(err); }
              })
            }
            obj = _.merge(obj,{cs_uid: projectFileMatch.docId, keep: projectFileMatch.keep });
          })
          res.status(200).send(files);
        }
      })
  });
}

export function upsert(req, res) {
  ProjectFile.findOne()
    .where('cs_uid').equals(req.params.id)
    .exec(function(err,entity){
      if(err){
        console.log('err')
      }
      else{
        entity.keep = req.body.keep;
        entity.save(function(err,obj){
          res.status(200).send(obj);
        })
      }
    })
}


export function create(req, res) {
  var moveFiles = _.chain(req.body.files)
                      .filter(function(o) { return o.keep == true })
                      .map(function(o) { return o.docId })
                      .value();
  var delFiles = _.chain(req.body.files)
                      .filter(function(o) { return o.keep == false })
                      .map(function(o) { return o.docId })
                      .value();
  var command = {
    project: req.body.project,
    moveFiles: moveFiles,
    delFiles: delFiles,
  }
  faClient.archive(command,function(response,body){
    res.status(200).send(command);
  });

}
