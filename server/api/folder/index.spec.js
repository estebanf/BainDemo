'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var folderCtrlStub = {
  index: 'folderCtrl.index',
  show: 'folderCtrl.show',
  create: 'folderCtrl.create',
  upsert: 'folderCtrl.upsert',
  patch: 'folderCtrl.patch',
  destroy: 'folderCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var folderIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './folder.controller': folderCtrlStub
});

describe('Folder API Router:', function() {
  it('should return an express router instance', function() {
    expect(folderIndex).to.equal(routerStub);
  });

  describe('GET /api/folders', function() {
    it('should route to folder.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'folderCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/folders/:id', function() {
    it('should route to folder.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'folderCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/folders', function() {
    it('should route to folder.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'folderCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/folders/:id', function() {
    it('should route to folder.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'folderCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/folders/:id', function() {
    it('should route to folder.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'folderCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/folders/:id', function() {
    it('should route to folder.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'folderCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
