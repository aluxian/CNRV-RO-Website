var utils = {}
  , async = require('async')
  , _ = require('underscore');

/**
 * Fetch the provided models' associated data. Used in async.waterfall
 * @param  models  Array of models to fetch
 * @param  field   Field of the data object to fetch for
 */
utils.fetchAssociations = function(models, field) {
  return function(data, callback) {
    var arrayed, items = data[field] || data;
    if (!(items instanceof Array)) {
      items = [items];
      arrayed = true;
    }

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
 * Fetches data required on every page (user, widgets etc.)
 * @param  session   Session object
 * @param  callback  Callback
 */
utils.loadPageData = function(pageData, session, callback) {
  // Defined tasks
  var tasks = {
    user: async.apply(geddy.model.User.first, {id: session.get('userId')})
  , recentPosts: async.apply(geddy.model.Post.all, null, {sort: {createdAt: 'desc'}, limit: 5})
  };

  // Only run tasks defined in the 'pageData' param
  _.each(tasks, function(val, key) {
    if (!_.contains(pageData, key))
      delete tasks[key];
  });
  
  async.parallel(tasks, callback);
};

module.exports = utils;
