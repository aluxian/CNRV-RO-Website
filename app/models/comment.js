var Comment = function () {
  this.defineProperties({
    name: {type: 'string'},
    content: {type: 'text', required: true},
    email: {type: 'string'}
  });

  this.belongsTo('Post');
  this.belongsTo('User');
};

Comment = geddy.model.register('Comment', Comment);
