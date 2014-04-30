var async = require('async')
  , utils = require('../modules/utils')
  , requireAuth = require('../helpers/passport').requireAuth;

var Categories = function () {
  this.before(requireAuth, {except: ['show']});
  this.respondsWith = ['html', 'json'];

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

  this.show = function(res, resp, params) {
    var options = {sort: {createdAt: 'desc'}, limit: 10}
      , q = {categoryId: params.id};

    // Parse 'page' parameter
    if (params.page) {
      options.skip = parseInt(params.page*10);
    }

    // Respond with posts
    utils.defaultRespond.bind(this)({
      posts: async.apply(async.waterfall, [
        async.apply(geddy.model.Post.all, q, options)
      , utils.fetchAssociations({fetch: ['User', 'Category', 'Comments']})
      ])
    , totalPosts: function(callback) {
        geddy.model.Post.all(q, null, function(err, posts) {
          callback(err, posts.length);
        });
      }
    }, { requiredRes: ['posts'] });
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
