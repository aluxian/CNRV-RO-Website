var async = require('async')
  , utils = require('../modules/utils')
  , requireAuth = require('../helpers/passport').requireAuth
  , security = require('../modules/security');

var Menus = function () {

  this.before(requireAuth);
  this.before(security.userHasAccess, { async: true });
  this.respondsWith = ['html', 'json'];

  this.index = function (req, resp, params) {
    utils.defaultIndex.bind(this)({
      menus: async.apply(geddy.model.Menu.all, null, {sort: {name: 'asc'}})
    });
  };

  this.create = utils.defaultCreate.bind(this, false, 'Meniu invalid.', 'Meniul a fost creat.');
  this.remove = utils.defaultRemove.bind(this, false, 'Meniul a fost șters.');

};

exports.Menus = Menus;
