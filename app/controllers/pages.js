var async = require('async')
  , utils = require('../modules/utils')
  , requireAuth = require('../helpers/passport').requireAuth
  , security = require('../modules/security');

var Pages = function () {
  this.before(requireAuth, { except: ['show'] });
  this.before(security.userHasAccess, { except: ['show'], async: true });
  this.respondsWith = ['html', 'json'];

  this.add = function (req, resp, params) {
    utils.defaultIndex.bind(this)({
      menus: async.apply(geddy.model.Menu.all, null, {sort: {name: 'asc'}})
    });
  };

  this.show = function (req, resp, params) {
    utils.defaultIndex.bind(this)({
      page: async.apply(async.waterfall, [
        async.apply(geddy.model.Page.first, params.id)
      ])
    }, { requiredRes: ['page'] });
  };

  this.edit = function (req, resp, params) {
    utils.defaultIndex.bind(this)({
      page: async.apply(async.waterfall, [
        async.apply(geddy.model.Page.first, params.id)
      , utils.fetchAssociations({fetch: ['Menu']})
      ])
    , menus: async.apply(geddy.model.Menu.all, null, {sort: {name: 'asc'}})
    }, { requiredRes: ['page'] });
  };

  this.create = utils.defaultCreate.bind(this, true, 'Pagină invalidă.', 'Pagina a fost creată.');
  this.update = utils.defaultUpdate.bind(this, true, 'Pagină invalidă.', 'Pagina a fost salvată.');
  this.remove = utils.defaultRemove.bind(this, true, 'Pagina a fost ștearsă.');

};

exports.Pages = Pages;
