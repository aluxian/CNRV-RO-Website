var async = require('async')
  , utils = require('../modules/utils')
  , requireAuth = require('../helpers/passport').requireAuth
  , security = require('../modules/security');

var Pages = function () {
  this.before(requireAuth, {
    only: ['add', 'create', 'edit', 'update',  'remove']
  });

  this.before(security.userHasAccess, {
    only: ['edit', 'update'],
    async: true
  });

  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Page.all(function(err, pages) {
      self.respondWith(pages, {type:'Page'});
    });
  };

  this.add = function (req, resp, params) {
    utils.defaultRespond.bind(this)({
      menus: async.apply(geddy.model.Menu.all, null, {sort: {name: 'asc'}})
    });
  };

  this.create = function (req, resp, params) {
    var self = this
      , page = geddy.model.Page.create(params);

    if (!page.isValid()) {
      this.respondWith(page);
    } else {
      page.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(page, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    utils.defaultRespond.bind(this)({
      page: async.apply(async.waterfall, [
        async.apply(geddy.model.Page.first, params.id)
      ])
    });
  };

  this.edit = function (req, resp, params) {
    utils.defaultRespond.bind(this)({
      page: async.apply(async.waterfall, [
        async.apply(geddy.model.Page.first, params.id)
      , utils.fetchAssociations({fetch: ['Menu']})
      ])
    , menus: async.apply(geddy.model.Menu.all, null, {sort: {name: 'asc'}})
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Page.first(params.id, function(err, page) {
      if (err) {
        throw err;
      }
      page.updateProperties(params);

      if (!page.isValid()) {
        self.respondWith(page);
      } else {
        page.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(page, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Page.first(params.id, function(err, page) {
      if (err) {
        throw err;
      }
      if (!page) {
        throw new geddy.errors.BadRequestError();
      } else {
        geddy.model.Page.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(page);
        });
      }
    });
  };

};

exports.Pages = Pages;
