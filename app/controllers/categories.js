var async = require('async')
  , utils = require('../modules/utils')
  , requireAuth = require('../helpers/passport').requireAuth;

var Categories = function () {
  this.before(requireAuth);
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.add = function (req, resp, params) {
    utils.defaultRespond.bind(this)({
      menus: async.apply(geddy.model.Category.all, null, {sort: {name: 'asc'}})
    });
  };

  this.create = function (req, resp, params) {
    var self = this
      , category = geddy.model.Category.create(params);

    if (!category.isValid()) {
      this.respondWith(category);
    } else {
      category.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(category, {status: err});
      });
    }
  };

  this.edit = function (req, resp, params) {
    /* To be implemented */
    var self = this;

    geddy.model.Category.first(params.id, function(err, category) {
      if (err) {
        throw err;
      }
      if (!category) {
        throw new geddy.errors.BadRequestError();
      } else {
        self.respondWith(category);
      }
    });
  };

  this.update = function (req, resp, params) {
    /* To be implemented */
    var self = this;

    geddy.model.Category.first(params.id, function(err, category) {
      if (err) {
        throw err;
      }
      category.updateProperties(params);

      if (!category.isValid()) {
        self.respondWith(category);
      } else {
        category.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(category, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    /* To be implemented */
    var self = this;

    geddy.model.Category.first(params.id, function(err, category) {
      if (err) {
        throw err;
      }
      if (!category) {
        throw new geddy.errors.BadRequestError();
      } else {
        geddy.model.Category.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(category);
        });
      }
    });
  };

};

exports.Categories = Categories;
