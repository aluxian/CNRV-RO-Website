var async = require('async')
  , utils = require('../modules/utils')
  , requireAuth = require('../helpers/passport').requireAuth
  , security = require('../modules/security');

var Menus = function () {
  this.before(requireAuth);
  this.before(security.userHasAccess, { async: true });
  this.respondsWith = ['html', 'json'];

  this.index = function (req, resp, params) {
    utils.defaultRespond.bind(this)({
      menus: async.apply(geddy.model.Menu.all, null, {sort: {name: 'asc'}})
    });
  };

  this.create = function (req, resp, params) {
    var self = this
      , menu = geddy.model.Menu.create(params);

    if (!menu.isValid()) {
      this.respondWith(menu);
    } else {
      menu.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.redirect({controller: self.name});
      });
    }
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Menu.first(params.id, function(err, menu) {
      if (err) {
        throw err;
      }
      if (!menu) {
        throw new geddy.errors.BadRequestError();
      } else {
        geddy.model.Menu.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(menu);
        });
      }
    });
  };

};

exports.Menus = Menus;
