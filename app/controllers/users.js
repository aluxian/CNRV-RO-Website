var async = require('async')
  , utils = require('../modules/utils')
  , passport = require('../helpers/passport')
  , security = require('../modules/security')
  , requireAuth = passport.requireAuth;

var Users = function () {
  
  this.before(requireAuth, { only: ['edit', 'update'] });
  this.respondsWith = ['html', 'json'];

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.show = function (req, resp, params) {
    var options = {sort: {createdAt: 'desc'}, limit: 10}
      , q = {userId: params.id};

    // Parse 'page' parameter
    if (params.page) {
      options.skip = parseInt(params.page*10);
    }

    // Respond with posts
    utils.defaultIndex.bind(this)({
      posts: async.apply(async.waterfall, [
        async.apply(geddy.model.Post.all, q, options)
      , utils.fetchAssociations({fetch: ['User', 'Category', 'Comments']})
      ])
    , totalPosts: function(callback) {
        geddy.model.Post.all(q, null, function(err, posts) {
          callback(err, posts.length);
        });
      }
    , totalComments: function(callback) {
        geddy.model.Comment.all(q, null, function(err, comments) {
          callback(err, comments.length);
        });
      }
    }, { requiredRes: ['posts'] });
  };

};

exports.Users = Users;
