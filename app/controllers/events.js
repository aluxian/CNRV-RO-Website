var async = require('async')
  , utils = require('../modules/utils')
  , requireAuth = require('../helpers/passport').requireAuth
  , security = require('../modules/security');

var Events = function () {

  this.before(requireAuth);
  this.before(security.userHasAccess, { async: true });
  this.respondsWith = ['html', 'json'];

  this.index = function (req, resp, params) {
    utils.defaultIndex.bind(this)({
      events: async.apply(geddy.model.Event.all, null, {sort: {dateStart: 'asc'}})
    });
  };

  this.create = utils.defaultCreate.bind(this, false, 'Eveniment invalid.', 'Evenimentul a fost creat.');
  this.remove = utils.defaultRemove.bind(this, false, 'Evenimentul a fost șters.');

};

exports.Events = Events;
