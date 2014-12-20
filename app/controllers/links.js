var async = require('async')
  , utils = require('../modules/utils')
  , requireAuth = require('../helpers/passport').requireAuth
  , security = require('../modules/security');

var Links = function () {
  
  this.before(requireAuth);
  this.before(security.userHasAccess, { async: true });
  this.respondsWith = ['html', 'json'];

  this.index = function (req, resp, params) {
    utils.defaultIndex.bind(this)({
      links: async.apply(geddy.model.Link.all, null, {sort: {name: 'asc'}})
    });
  };

  this.create = utils.defaultCreate.bind(this, false, 'Link invalid.', 'Linkul a fost creat.');
  this.remove = utils.defaultRemove.bind(this, false, 'Linkul a fost șters.');

};

exports.Links = Links;
