var Pages = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Page.all(function(err, pages) {
      self.respondWith(pages, {type:'Page'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , page = geddy.model.Page.create(params);

    if (!page.isValid()) {
      this.respondWith(page);
    }
    else {
      page.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(page, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Page.first(params.id, function(err, page) {
      if (err) {
        throw err;
      }
      if (!page) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respondWith(page);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Page.first(params.id, function(err, page) {
      if (err) {
        throw err;
      }
      if (!page) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(page);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Page.first(params.id, function(err, page) {
      if (err) {
        throw err;
      }
      page.updateProperties(params);

      if (!page.isValid()) {
        self.respondWith(page);
      }
      else {
        page.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(page, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Page.first(params.id, function(err, page) {
      if (err) {
        throw err;
      }
      if (!page) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Page.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(page);
        });
      }
    });
  };

};

exports.Pages = Pages;
