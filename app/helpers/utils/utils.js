var utils = {}
  , async = require('async')
  , _ = require('underscore');

/**
 * Fetch the provided models' associated data. Used in async.waterfall
 * @param   models  Array of models to fetch
 * @param   field   Field of the data object to fetch for
 * @return          A function to be called by async
 */
utils.fetchAssociations = function(models, field) {
  return function(data, callback) {
    // Make sure 'data' is formatted to work with the fetcher
    var arrayed, items = data[field] || data;
    if (!(items instanceof Array)) {
      items = [items];
      arrayed = true;
    }

    // Model fetcher
    async.each(items, function(item, callback) {
      async.each(models, function(model, callback) {
        item['get' + model](function(err, modelData) {
          item[model.toLowerCase()] = modelData;
          callback(err);
        });
      }, callback);
    }, function(err) {
      if (arrayed) {
        items = items[0];
      }
      
      if (field) {
        data[field] = items;
      } else {
        data = items;
      }
      
      callback(err, data);
    });
  };
};

/**
 * Fetches data required on every page (user, widgets, navigation etc.)
 * @param  session   Session object
 * @param  callback  Callback
 */
utils.loadPageData = function(pageData, session, callback) {
  // Defined tasks
  var tasks = {
    user: async.apply(geddy.model.User.first, {id: session.get('userId')})
  , recentPosts: async.apply(geddy.model.Post.all, null, {sort: {createdAt: 'desc'}, limit: 5})
  , recentComments: async.apply(geddy.model.Comment.all, null, {sort: {createdAt: 'desc'}, limit: 5})
  , navCategories: async.apply(geddy.model.Category.all, null, {sort: {name: 'asc'}})
  , menus: async.apply(async.waterfall, [
      async.apply(geddy.model.Menu.all, null, {sort: {name: 'asc'}})
    , utils.fetchAssociations(['Pages'])
    ])
  };

  // Only run tasks defined in the 'pageData' param
  if (pageData) {
    _.each(tasks, function(val, key) {
      if (!_.contains(pageData, key))
        delete tasks[key];
    });
  }
  
  async.parallel(tasks, callback);
};

/**
 * Generate gravatar.com url using author's email address for comments
 * @param  data      Data object which contains a post with comments
 * @param  callback  Callback method
 */
utils.generateAvatars = function(data, callback) {
  _.each(data.post.comments, function(comment) {
    var email = (comment.user && comment.user.email) || comment.email;
    if (email) {
      comment.avatarHash = require('crypto').createHash('md5').update(email).digest('hex');
    }
  });
  callback(null, data);
};

module.exports = utils;
