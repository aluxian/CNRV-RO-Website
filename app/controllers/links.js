var async = require('async')
  , utils = require('../modules/utils')
  , requireAuth = require('../helpers/passport').requireAuth
  , security = require('../modules/security');

var Links = function () {
  this.before(requireAuth);

  this.before(security.userHasAccess, {
    async: true
  });

  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    utils.defaultRespond.bind(this)({
      links: async.apply(geddy.model.Link.all, null, {sort: {name: 'asc'}})
    });
  };

  this.create = function (req, resp, params) {
    var self = this
      , link = geddy.model.Link.create(params);

    if (!link.isValid()) {
      this.respondWith(link);
    } else {
      link.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.redirect({controller: self.name});
      });
    }
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Link.first(params.id, function(err, link) {
      if (err) {
        throw err;
      }
      if (!link) {
        throw new geddy.errors.BadRequestError();
      } else {
        geddy.model.Link.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(link);
        });
      }
    });
  };

};

exports.Links = Links;
