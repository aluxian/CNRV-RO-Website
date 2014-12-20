var Main = function () {
  
  this.respondsWith = ['html'];

  this.logout = function (req, resp, params) {
    this.session.unset('userId');
    this.session.unset('authType');
    this.redirect(this.session.get('lastVisitUrl') || '/');
  };

};

exports.Main = Main;
