var async = require('async')
  , utils = require('../helpers/utils')
  , moment = require('moment')
  , _ = require('underscore');

var Posts = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params, q) {
    var self = this
      , options = {sort: {createdAt: 'desc'}, limit: 10};

    // Parse 'date' parameter
    /*if (params.date) {
      q = q || {};
      q.createdAt = {'like': '2013-11-16'}; // moment(params.date*1000).format().substring(0, 10)
    }*/

    // Parse 'skip' parameter
    if (params.skip) {
      options.skip = parseInt(params.skip);
    }

    async.waterfall([
      // Load data
      async.apply(async.parallel, {
        posts: async.apply(geddy.model.Post.all, q, options)
      , pageData: async.apply(utils.loadPageData, ['user', 'recentPosts'], self.session)
      })
      // Parse data
    , utils.fetchAssociations(['User', 'Category', 'Comments'], 'posts')
    ], function(err, data) {
      data = _.extend(data, data.pageData);
      delete data.pageData;

      if (err) {
        throw err;
      } else if (!data.posts) {
        throw new geddy.errors.NotFoundError();
      } else {
        self.respond(data, {
          format: 'html'
        , template: 'app/views/posts/index'
        });
      }
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , post = geddy.model.Post.create(params);

    if (!post.isValid()) {
      this.respondWith(post);
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
    var self = this;

    async.waterfall([
      // Load data
      async.apply(async.parallel, {
        post: async.apply(geddy.model.Post.first, params.id)
      , pageData: async.apply(utils.loadPageData, ['user', 'recentPosts'], self.session)
      })
      // Parse data
    , utils.fetchAssociations(['User', 'Category', 'Comments'], 'post')
    , function(data, callback) {
        utils.fetchAssociations(['User'], 'comments')(data.post, function(err, pData) {
          data.post = pData;
          callback(err, data);
        });
      }
    ], function(err, data) {
      data = _.extend(data, data.pageData);
      delete data.pageData;

      if (err) {
        throw err;
      } else if (!data.post) {
        throw new geddy.errors.NotFoundError();
      } else {
        self.respond(data, {
          format: 'html'
        , template: 'app/views/posts/show'
        });
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Post.first(params.id, function(err, post) {
      if (err) {
        throw err;
      } if (!post) {
        throw new geddy.errors.BadRequestError();
      } else {
        self.respondWith(post);
      }
    });
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
        geddy.model.Post.remove(params.id, function(err) {
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
