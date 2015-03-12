var Post = function () {
  this.defineProperties({
    title: {type: 'string', required: true},
    content: {type: 'text', required: true},
    status: {type: 'string', required: true},
    reviewed: {type: 'boolean'}
  });

  // Check that 'status' is valid
  this.validatesWithFunction('status', function (s) {
    return ['draft', 'published'].indexOf(s) > -1;
  });

  this.hasMany('Comments');
  this.belongsTo('Category');
  this.belongsTo('User');
};

Post = geddy.model.register('Post', Post);
