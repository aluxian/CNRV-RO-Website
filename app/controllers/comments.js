var utils = require('../modules/utils')
  , requireAuth = require('../helpers/passport').requireAuth
  , security = require('../modules/security');

var Comments = function () {
  this.before(requireAuth, {only: ['remove']});
  this.before(security.userIsAdmin, { only: ['remove'], async: true });
  this.respondsWith = ['html', 'json'];

  this.create = function(req, resp, params) {
    var self = this
      , model = geddy.model.Comment.create(params);

    if (!model.isValid()) {
      self.flash.error('Comentariu invalid.');
      self.redirect({controller: 'Posts', id: params.postId});
    } else {
      model.save(function(err) {
        if (err) { throw err; }

        self.flash.success('Comentariul a fost adăugat.');
        self.redirect({controller: 'Posts', id: params.postId});
      });
    }
  };

  this.remove = function(req, resp, params) {
    var self = this
      , modelName = geddy.string.capitalize(geddy.inflection.singularize(self.name));

    geddy.model[modelName].first(params.id, function(err, model) {
      if (err) { throw err; }
      if (!model) {
        throw new geddy.errors.BadRequestError();
      } else {
        geddy.model[modelName].remove(params.id, function(err) {
          if (err) { throw err; }
          self.flash.success('Comentariul a fost șters.');
          self.redirect({controller: 'posts', id: model.postId});
        });
      }
    });
  };

};

exports.Comments = Comments;
