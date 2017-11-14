const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routing from './main.routes';
import * as _ from 'lodash';

export class MainController {
  $http;
  socket;
  projects = [];
  showNewFolder = false;
  newFolder = '';
  activeProject = null;
  projectFiles = [];

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('folder');
    });
  }

  $onInit() {
    this.$http.get('/api/folders').then(response => {
      this.projects = _.map(response.data,function(value,key){
        return _.merge(value,{ active:false })
      });
      this.socket.syncUpdates('folder', this.projects);
    });
  }

  addProject() {
    if(!this.showNewFolder){
      this.newFolder = '';
      this.showNewFolder=true;
    }
    else{
      if(this.newFolder != ''){
        this.$http.post('/api/folders', { name: this.newFolder })
          .then(data => {
            this.showNewFolder = false;

          })
      }
    }
  }
  selectProject(project){
    if(this.activeProject){
      this.activeProject.active = false;
    }
    project.active=true;
    this.activeProject = project;
    this.$http.get('/api/faClient/' + project.name).then(response => {
      this.projectFiles = response.data;
    })
  }
  toogleKeep(file){
    file.keep = !file.keep;
    this.$http.put('/api/faClient/' + file.docId,file).then(response => {

    })
  }
  archive(){
    if(this.activeProject && this.projectFiles){
      this.$http.post('/api/faClient/',{project: this.activeProject.name, files:_.map(this.projectFiles,function(o){
        return { docId: o.docId, keep: o.keep }
      })}).then(response => {
        console.log(response);
      })
    }
  }
}

export default angular.module('bainDemoApp.main', [
  uiRouter])
    .config(routing)
    .component('main', {
      template: require('./main.pug'),
      controller: MainController
    })
    .name;
