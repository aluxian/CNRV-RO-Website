var Comments = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.create = function (req, resp, params) {
    var self = this
      , comment = geddy.model.Comment.create(params);

    if (!comment.isValid()) {
      self.flash.error('Invalid comment, please try again.');
      self.redirect({controller: 'Posts', id: params.postId});
    } else {
      comment.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.flash.success('Comment posted!');
        self.redirect({controller: 'Posts', id: params.postId});
      });
    }
  };

  this.update = function (req, resp, params) {
    /* To be implemented */
    var self = this;

    geddy.model.Comment.first(params.id, function(err, comment) {
      if (err) {
        throw err;
      }
      comment.updateProperties(params);

      if (!comment.isValid()) {
        self.respondWith(comment);
      } else {
        comment.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(comment, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    /* To be implemented */
    var self = this;

    geddy.model.Comment.first(params.id, function(err, comment) {
      if (err) {
        throw err;
      }
      if (!comment) {
        throw new geddy.errors.BadRequestError();
      } else {
        geddy.model.Comment.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(comment);
        });
      }
    });
  };

};

exports.Comments = Comments;
