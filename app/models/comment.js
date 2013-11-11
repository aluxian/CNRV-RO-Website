var Comment = function () {
  this.defineProperties({
    content: {type: 'text'}
  });

  this.belongsTo('Post');
  this.belongsTo('User');
};

Comment = geddy.model.register('Comment', Comment);
