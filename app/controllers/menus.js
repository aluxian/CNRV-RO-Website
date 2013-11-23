var Menus = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Menu.all(function(err, menus) {
      self.respondWith(menus, {type:'Menu'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , menu = geddy.model.Menu.create(params);

    if (!menu.isValid()) {
      this.respondWith(menu);
    } else {
      menu.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(menu, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Menu.first(params.id, function(err, menu) {
      if (err) {
        throw err;
      }
      if (!menu) {
        throw new geddy.errors.NotFoundError();
      } else {
        self.respondWith(menu);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Menu.first(params.id, function(err, menu) {
      if (err) {
        throw err;
      }
      if (!menu) {
        throw new geddy.errors.BadRequestError();
      } else {
        self.respondWith(menu);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Menu.first(params.id, function(err, menu) {
      if (err) {
        throw err;
      }
      menu.updateProperties(params);

      if (!menu.isValid()) {
        self.respondWith(menu);
      } else {
        menu.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(menu, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Menu.first(params.id, function(err, menu) {
      if (err) {
        throw err;
      }
      if (!menu) {
        throw new geddy.errors.BadRequestError();
      } else {
        geddy.model.Menu.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(menu);
        });
      }
    });
  };

};

exports.Menus = Menus;
