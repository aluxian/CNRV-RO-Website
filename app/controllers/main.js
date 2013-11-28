var async = require('async')
  , utils = require('../modules/utils');

var Main = function () {
  this.respondsWith = ['html'];

  this.login = function (req, resp, params) {
    var self = this;
    
    utils.defaultRespond.bind(self)({
      pageData: async.apply(utils.loadPageData, ['user', 'nav'], self.session)
    }, {template: 'app/views/main/login'});
  };

  this.logout = function (req, resp, params) {
    this.session.unset('userId');
    this.session.unset('authType');
    this.redirect('/');
  };

};

exports.Main = Main;
