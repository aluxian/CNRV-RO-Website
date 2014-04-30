var Comments = function () {
  this.respondsWith = ['html', 'json'];

  this.create = function (req, resp, params) {
    var self = this
      , comment = geddy.model.Comment.create(params);

    if (!comment.isValid()) {
      self.flash.error('Comentariu invalid.');
      self.redirect({controller: 'Posts', id: params.postId});
    } else {
      comment.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.flash.success('Comentariul a fost adăugat.');
        self.redirect({controller: 'Posts', id: params.postId});
      });
    }
  };

  this.remove = function (req, resp, params) {
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
