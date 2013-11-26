var security = {}
  , async = require('async')
  , _ = require('underscore');

/**
 * Check if the logged in user has access to edit this resource
 * @param  next  Callback
 */
security.userHasAccess = function(next) {
  var self = this
    , userId = self.session.get('userId')
    , resName = geddy.inflection.singularize(self.name)
    , resId = self.params.id;

  async.parallel({
    res: async.apply(geddy.model[resName].first, {id: resId})
  , user: async.apply(geddy.model.User.first, {id: userId})
  }, function(err, data) {
    if (err) {
      throw err;
    }

    // User is admin or he owns the resource
    if (data.user.role === 'admin' || data.res.userId === userId) {
      next();
    }
    // Redirect and set flash message
    else {
      self.flash.error('You don\'t have access to this ' + resName.toLowerCase() + '.');
      self.redirect({controller: self.name, id: resId});
    }
  });
};

module.exports = security;
