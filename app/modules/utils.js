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
    (function parseAssoc(assoc, items, callback) {
      var arrayed = false;
      if (!_.isArray(items)) {
        items = [items];
        arrayed = true;
      }

      async.series([
        async.apply(async.each, assoc.fetch, function(assoc, callback) {
          if (_.isString(assoc)) {
            async.each(items, function(item, callback) {
              item['get' + assoc](function(err, data) {
                item[assoc.toLowerCase()] = data;
                callback(err);
              });
            }, callback);
          } else {
            callback(null);
          }
        })
      , async.apply(async.each, assoc.fetch, function(assoc, callback) {
          if (!_.isString(assoc)) {
            async.each(items, function(item, callback) {
              parseAssoc(assoc, item[assoc.for], callback);
            }, callback);
          } else {
            callback(null);
          }
        })
      ], function(err) {
        if (arrayed) {
          items = items[0];
        }
        callback(err, items);
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
      , utils.fetchAssociations({fetch: ['User']})
      ])
    , events: async.apply(geddy.model.Event.all, null, {sort: {dateStart: 'asc'}, limit: 5})
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
 * Fetches page data, does other tasks and responds with it
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
    } else if (options && options.requiredRes && !options.requiredRes.every(function(obj) { return data[obj]; })) {
      throw new geddy.errors.BadRequestError();
    } else {
      self.respond(data, options && options.respond);
    }
  });
};

module.exports = utils;
