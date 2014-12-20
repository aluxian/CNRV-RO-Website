var async = require('async')
  , utils = require('../modules/utils')
  , passport = require('../helpers/passport')
  , security = require('../modules/security')
  , cryptPass = passport.cryptPass
  , requireAuth = passport.requireAuth;

var Users = function () {

  this.before(requireAuth, { only: ['edit', 'update'] });
  this.respondsWith = ['html', 'json'];

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , user = geddy.model.User.create(params)
      , sha;

    // Non-blocking uniqueness checks are hard
    geddy.model.User.first({username: user.username}, function(err, data) {
      if (err) throw err;

      if (data) {
        self.flash.error('Acest nume de utilizator este deja folosit.');
        //self.transfer('add');
      } else {
        if (user.isValid()) {
          user.password = cryptPass(user.password);
        }

        user.save(function(err, data) {
          if (err) {
            if (err.password) {
              self.flash.error('Parolă invalidă.');
            } else if (err.username) {
              self.flash.error('Nume de utilizator invalid.');
            } else {
              throw err;
            }
          } else {
            self.flash.success('Contul a fost creat.');
            self.session.set('lastVisitUrl', self.session.get('successRedirect'));
            self.redirect('/login');
          }
        });
      }
    });
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
