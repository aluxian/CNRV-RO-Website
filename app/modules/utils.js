var utils = {}
  , async = require('async')
  , _ = require('underscore');

/**
 * Fetch the provided models' associated data. Used in async.waterfall
 * @param  assoc  Object to tell what to fetch
 *
 * assoc = {
 *   for: ''    // field of the data object to fetch in
 *   fetch: []  // array of strings or other assoc objects to fetch
 * }
 */
utils.fetchAssociations = function(assoc) {
  return function(data, callback) {
    (function parseAssoc(assoc, mData, callback) {
      var arrayed = false
        , items = mData[assoc.for] || mData;

      if (!_.isArray(items)) {
        items = [items];
        arrayed = true;
      }

      async.each(assoc.fetch, function(assoc, callback) {
        if (_.isString(assoc)) {
          async.each(items, function(item, callback) {
            item['get' + assoc](function(err, data) {
              item[assoc.toLowerCase()] = data;
              callback(err);
            });
          }, callback);
        } else {
          parseAssoc(assoc, items, function(err, data) {
            items = data;
            callback(err);
          });
        }
      }, function(err) {
        if (arrayed) {
          items = items[0];
        }
        if (assoc.for) {
          mData[assoc.for] = items;
        }
        callback(err, mData);
      });
    })(assoc, data, callback);
  };
};

/**
 * Fetches data required on every page (user, widgets, navigation etc.)
 * @param  session   Session object
 * @param  callback  Callback
 */
utils.loadPageData = function(dataToLoad, session, callback) {
  // Defined tasks
  var tasks = {
    user: async.apply(geddy.model.User.first, {id: session.get('userId')})

  , widgets: async.apply(async.parallel, {
      recentPosts: async.apply(geddy.model.Post.all, null, {sort: {createdAt: 'desc'}, limit: 5})
    , recentComments: async.apply(async.waterfall, [
        async.apply(geddy.model.Comment.all, null, {sort: {createdAt: 'desc'}, limit: 5})
      , utils.generateAvatarsForComments
      ])
    , links: async.apply(geddy.model.Link.all, null, {sort: {name: 'asc', createdAt: 'asc'}})
    })

  , nav: async.apply(async.parallel, {
      categories: async.apply(geddy.model.Category.all, null, {sort: {name: 'asc'}})
    , menus: async.apply(async.waterfall, [
        async.apply(geddy.model.Menu.all, null, {sort: {name: 'asc'}})
      , utils.fetchAssociations({fetch: ['Pages']})
      ])
    })
  };

  // Only run tasks defined in the 'dataToLoad' arg
  if (dataToLoad) {
    _.each(tasks, function(val, key) {
      if (!_.contains(dataToLoad, key))
        delete tasks[key];
    });
  }
  
  async.parallel(tasks, callback);
};

/**
 * Generate a gravatar.com image hash using author's email address
 * @param  comment   Comment object
 * @param  callback  Callback method
 */
utils.generateAvatar = function(comment) {
  var email = (comment.user && comment.user.email) || comment.email;
  if (email) {
    comment.avatarHash = require('crypto').createHash('md5').update(email).digest('hex');
  }
};

/**
 * Generate avatar hashes for the post's comments
 * @param  post      Post object which contains the comments
 * @param  callback  Callback method
 */
utils.generateAvatarsForPost = function(post, callback) {
  _.each(post.comments, utils.generateAvatar);
  callback(null, post);
};

/**
 * Generate avatar hashes for the comments array
 * @param  post      Comments array
 * @param  callback  Callback method
 */
utils.generateAvatarsForComments = function(comments, callback) {
  _.each(comments, utils.generateAvatar);
  callback(null, comments);
};

/**
 * Fetches page data, does other tasks and respond with it
 * @param  newTasks  New tasks to be done additionally to pageData
 */
utils.defaultRespond = function(newTasks, options) {
  var self = this
    , tasks = {
      pageData: async.apply(utils.loadPageData, null, self.session)
    };

  async.parallel(_.extend(tasks, newTasks), function(err, data) {
    if (err) {
      throw err;
    } else {
      self.respond(data, options);
    }
  });
};

module.exports = utils;
