var utils = require('../modules/utils')
  , requireAuth = require('../helpers/passport').requireAuth
  , security = require('../modules/security');

var Comments = function () {
  this.before(requireAuth, {only: ['remove']});
  this.before(security.userHasAccess, { only: ['remove'], async: true });
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

  this.remove = utils.defaultRemove.bind(this, true, 'Comentariul a fost șters.');

};

exports.Comments = Comments;
