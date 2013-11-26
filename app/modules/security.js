var security = {}
  , async = require('async')
  , _ = require('underscore');

security.userHasAccess = function(next) {
  var self = this
    , userId = self.session.get('userId')
    , res = geddy.inflection.singularize(self.name)
    , resId = self.params.id;

  geddy.model[res].first({id: resId}, function(err, res) {
    if (err) {
      throw err;
    }

    // User owns the resource
    if (res.userId === userId) {
      next();
    }
    // Redirect and set flash message
    else {
      self.flash.error('You don\'t have access to this ' + res.toLowerCase() + '.');
      self.redirect({controller: self.name, id: resId});
    }
  });
};

module.exports = security;
