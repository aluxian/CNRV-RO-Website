var async = require('async')
  , utils = require('../modules/utils')
  , requireAuth = require('../helpers/passport').requireAuth
  , security = require('../modules/security');

var Posts = function () {
  this.before(requireAuth, { except: ['index', 'show'] });
  this.before(security.userHasAccess, { only: ['edit', 'update'], async: true });
  this.respondsWith = ['html', 'json'];

  this.index = function (req, resp, params, q, viewOptions) {
    var options = {sort: {createdAt: 'desc'}, limit: 10};

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
    }, { respond: viewOptions || {template: 'app/views/posts/index'}, requiredRes: ['posts'] });
  };

  this.add = function (req, resp, params) {
    utils.defaultRespond.bind(this)({
      categories: async.apply(geddy.model.Category.all, null, {sort: {name: 'asc'}})
    });
  };

  this.create = function (req, resp, params) {
    var self = this
      , post = geddy.model.Post.create(params);

    if (!post.isValid()) {
      self.respondWith(post);
    } else {
      post.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(post, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    utils.defaultRespond.bind(this)({
      post: async.apply(async.waterfall, [
        async.apply(geddy.model.Post.first, params.id)
      , utils.fetchAssociations({fetch: ['User', 'Category', 'Comments', {for: 'comments', fetch: ['User']}]})
      ])
    }, { requiredRes: ['post'] });
  };

  this.edit = function (req, resp, params) {
    utils.defaultRespond.bind(this)({
      post: async.apply(async.waterfall, [
        async.apply(geddy.model.Post.first, params.id)
      , utils.fetchAssociations({fetch: ['Category']})
      ])
    , categories: async.apply(geddy.model.Category.all, null, {sort: {name: 'asc'}})
    }, { requiredRes: ['post'] });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Post.first(params.id, function(err, post) {
      if (err) {
        throw err;
      }
      post.updateProperties(params);

      if (!post.isValid()) {
        self.respondWith(post);
      } else {
        post.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(post, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Post.first(params.id, function(err, post) {
      if (err) {
        throw err;
      } if (!post) {
        throw new geddy.errors.BadRequestError();
      } else {
        // Remove post and its comments
        async.parallel([
          async.apply(geddy.model.Comment.remove, {postId: params.id})
        , async.apply(geddy.model.Post.remove, params.id)
        ], function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(post);
        });
      }
    });
  };

};

exports.Posts = Posts;
