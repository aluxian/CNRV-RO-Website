var async = require('async')
  , utils = require('../modules/utils')
  , requireAuth = require('../helpers/passport').requireAuth
  , security = require('../modules/security');

var Events = function () {
  this.before(requireAuth);
  this.before(security.userHasAccess, { async: true });
  this.respondsWith = ['html', 'json'];

  this.index = function (req, resp, params) {
    utils.defaultRespond.bind(this)({
      events: async.apply(geddy.model.Event.all, null, {sort: {dateStart: 'asc'}})
    });
  };

  this.create = function (req, resp, params) {
    var self = this
      , event = geddy.model.Event.create(params);

    if (!event.isValid()) {
      this.respondWith(event);
      self.redirect({controller: self.name});
    } else {
      event.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.redirect({controller: self.name});
      });
    }
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Event.first(params.id, function(err, event) {
      if (err) {
        throw err;
      }
      if (!event) {
        throw new geddy.errors.BadRequestError();
      } else {
        geddy.model.Event.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(event);
        });
      }
    });
  };

};

exports.Events = Events;
