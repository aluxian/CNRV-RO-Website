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
      , utils.fetchAssociations({fetch: ['User', 'Post']})
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
utils.defaultIndex = function(newTasks, options) {
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

/**
 * Creates a model using the supplied parameters
 * @param  invalidMessage Message to be flashed if the params are invalid
 * @param  successMessage Message to be flashed if the model is created
 * @param  respondWith    If true the route will respond with the object, otherwise it will redirect
 * @param  params         Params to use
 */
utils.defaultCreate = function(respondWith, invalidMessage, successMessage, req, resp, params) {
  var self = this
    , modelName = geddy.string.capitalize(geddy.inflection.singularize(self.name))
    , model = geddy.model[modelName].create(params);

  if (!model.isValid()) {
    self.flash.error(invalidMessage);

    if (respondWith) {
      if (typeof respondWith == 'boolean') {
        self.respondWith(model);
      } else {
        self.redirect(respondWith);
      }
    } else {
      self.redirect({controller: self.name});
    }
  } else {
    model.save(function(err) {
      if (err) { throw err; }
      self.flash.success(successMessage);

      if (respondWith) {
        if (typeof respondWith == 'boolean') {
          self.respondWith(model);
        } else {
          self.redirect(respondWith);
        }
      } else {
        self.redirect({controller: self.name});
      }
    });
  }
};

/**
 * Update a model with the supplied parameters
 * @param  invalidMessage Message to be flashed if the params are invalid
 * @param  successMessage Message to be flashed if the model is updated
 * @param  respondWith    If true the route will respond with the object, otherwise it will redirect
 * @param  params         Params to use
 */
utils.defaultUpdate = function(respondWith, invalidMessage, successMessage, req, resp, params) {
  var self = this;

  geddy.model[modelName].first(params.id, function(err, model) {
    if (err) { throw err; }
    model.updateProperties(params);

    if (!model.isValid()) {
      self.flash.error(invalidMessage);

      if (respondWith) {
        self.respondWith(model);
      } else {
        self.redirect({controller: self.name});
      }
    } else {
      model.save(function(err, data) {
        if (err) { throw err; }
        self.flash.success(successMessage);

        if (respondWith) {
          self.respondWith(model);
        } else {
          self.redirect({controller: self.name});
        }
      });
    }
  });
};

/**
 * Remove a model
 * @param  successMessage Message to be flashed if the removal is successful
 * @param  respondWith    If true the route will respond with the object, otherwise it will redirect
 * @param  params         Object containing the ID
 */
utils.defaultRemove = function(successMessage, respondWith, req, resp, params) {
  var self = this
    , modelName = geddy.string.capitalize(geddy.inflection.singularize(self.name));

  geddy.model[modelName].first(params.id, function(err, model) {
    if (err) { throw err; }
    if (!model) {
      throw new geddy.errors.BadRequestError();
    } else {
      geddy.model[modelName].remove(params.id, function(err) {
        if (err) { throw err; }
        self.flash.success(successMessage);

        if (respondWith) {
          self.respondWith(model);
        } else {
          self.redirect({controller: self.name});
        }
      });
    }
  });
};

module.exports = utils;
