'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newFolder;

describe('Folder API:', function() {
  describe('GET /api/folders', function() {
    var folders;

    beforeEach(function(done) {
      request(app)
        .get('/api/folders')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          folders = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(folders).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/folders', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/folders')
        .send({
          name: 'New Folder',
          info: 'This is the brand new folder!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newFolder = res.body;
          done();
        });
    });

    it('should respond with the newly created folder', function() {
      expect(newFolder.name).to.equal('New Folder');
      expect(newFolder.info).to.equal('This is the brand new folder!!!');
    });
  });

  describe('GET /api/folders/:id', function() {
    var folder;

    beforeEach(function(done) {
      request(app)
        .get(`/api/folders/${newFolder._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          folder = res.body;
          done();
        });
    });

    afterEach(function() {
      folder = {};
    });

    it('should respond with the requested folder', function() {
      expect(folder.name).to.equal('New Folder');
      expect(folder.info).to.equal('This is the brand new folder!!!');
    });
  });

  describe('PUT /api/folders/:id', function() {
    var updatedFolder;

    beforeEach(function(done) {
      request(app)
        .put(`/api/folders/${newFolder._id}`)
        .send({
          name: 'Updated Folder',
          info: 'This is the updated folder!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedFolder = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedFolder = {};
    });

    it('should respond with the updated folder', function() {
      expect(updatedFolder.name).to.equal('Updated Folder');
      expect(updatedFolder.info).to.equal('This is the updated folder!!!');
    });

    it('should respond with the updated folder on a subsequent GET', function(done) {
      request(app)
        .get(`/api/folders/${newFolder._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let folder = res.body;

          expect(folder.name).to.equal('Updated Folder');
          expect(folder.info).to.equal('This is the updated folder!!!');

          done();
        });
    });
  });

  describe('PATCH /api/folders/:id', function() {
    var patchedFolder;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/folders/${newFolder._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Folder' },
          { op: 'replace', path: '/info', value: 'This is the patched folder!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedFolder = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedFolder = {};
    });

    it('should respond with the patched folder', function() {
      expect(patchedFolder.name).to.equal('Patched Folder');
      expect(patchedFolder.info).to.equal('This is the patched folder!!!');
    });
  });

  describe('DELETE /api/folders/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/folders/${newFolder._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when folder does not exist', function(done) {
      request(app)
        .delete(`/api/folders/${newFolder._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
