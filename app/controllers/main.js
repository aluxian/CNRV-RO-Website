var async = require('async')
  , utils = require('../modules/utils');

var Main = function () {

  this.respondsWith = ['html'];

  this.login = function (req, resp, params) {
    var self = this;

    utils.defaultIndex.bind(self)({
      pageData: async.apply(utils.loadPageData, ['user', 'nav'], self.session)
    }, {respond: { template: 'app/views/main/login' }});
  };

  this.logout = function (req, resp, params) {
    this.session.unset('userId');
    this.session.unset('authType');
    this.redirect(this.session.get('lastVisitUrl') || '/');
  };

};

exports.Main = Main;
