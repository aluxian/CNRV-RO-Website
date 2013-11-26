var Links = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Link.all(function(err, links) {
      self.respondWith(links, {type:'Link'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
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
        self.respondWith(link, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Link.first(params.id, function(err, link) {
      if (err) {
        throw err;
      }
      if (!link) {
        throw new geddy.errors.NotFoundError();
      } else {
        self.respondWith(link);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Link.first(params.id, function(err, link) {
      if (err) {
        throw err;
      }
      if (!link) {
        throw new geddy.errors.BadRequestError();
      } else {
        self.respondWith(link);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Link.first(params.id, function(err, link) {
      if (err) {
        throw err;
      }
      link.updateProperties(params);

      if (!link.isValid()) {
        self.respondWith(link);
      } else {
        link.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(link, {status: err});
        });
      }
    });
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
