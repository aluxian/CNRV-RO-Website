var async = require('async')
  , utils = require('../modules/utils')
  , requireAuth = require('../helpers/passport').requireAuth
  , security = require('../modules/security');

var Categories = function () {

  this.before(requireAuth, {except: ['show']});
  this.before(security.userHasAccess, { async: true });
  this.respondsWith = ['html', 'json'];

  this.index = function (req, resp, params) {
    utils.defaultIndex.bind(this)({
      categories: async.apply(async.waterfall, [
        async.apply(geddy.model.Category.all, null, {sort: {name: 'asc'}})
      , utils.fetchAssociations({fetch: ['Posts']})
      , function(categories, callback) {
        for (var i = 0; i < categories.length; i++) {
          categories[i].posts = categories[i].posts.length;
        }
        callback(null, categories);
      }
      ])
    });
  };

  this.show = function(res, resp, params) {
    var options = {sort: {createdAt: 'desc'}, limit: 10}
      , q = {categoryId: params.id};

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
    }, { requiredRes: ['posts'] });
  };

  this.create = utils.defaultCreate.bind(this, false, 'Categorie invalidă.', 'Categoria a fost creată.');
  this.remove = utils.defaultRemove.bind(this, false, 'Categoria a fost ștearsă.');

};

exports.Categories = Categories;
