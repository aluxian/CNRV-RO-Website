var Posts = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Post.all(function(err, posts) {
      self.respondWith(posts, {type:'Post'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , post = geddy.model.Post.create(params);

    if (!post.isValid()) {
      this.respondWith(post);
    }
    else {
      post.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(post, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Post.first(params.id, function(err, post) {
      if (err) {
        throw err;
      }
      if (!post) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respondWith(post);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Post.first(params.id, function(err, post) {
      if (err) {
        throw err;
      }
      if (!post) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(post);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Post.first(params.id, function(err, post) {
      if (err) {
        throw err;
      }
      post.updateProperties(params);

      if (!post.isValid()) {
        self.respondWith(post);
      }
      else {
        post.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(post, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Post.first(params.id, function(err, post) {
      if (err) {
        throw err;
      }
      if (!post) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Post.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(post);
        });
      }
    });
  };

};

exports.Posts = Posts;
