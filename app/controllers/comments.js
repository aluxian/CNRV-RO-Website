var utils = require('../modules/utils')
  , requireAuth = require('../helpers/passport').requireAuth
  , security = require('../modules/security');

var Comments = function () {
  this.before(requireAuth, {only: ['remove']});
  this.before(security.userHasAccess, { only: ['remove'], async: true });
  this.respondsWith = ['html', 'json'];

  this.create = utils.defaultCreate.bind(this
    , {controller: 'Posts', id: params.postId}
    , 'Comentariu invalid.'
    , 'Comentariul a fost adăugat.'
  );

  this.remove = utils.defaultRemove.bind(this, true, 'Comentariul a fost șters.');

};

exports.Comments = Comments;
