var Post = function () {
  this.defineProperties({
    title: {type: 'string', required: true},
    content: {type: 'text'},
    status: {type: 'string'}
  });

  this.validatesWithFunction('status', function (s) {
    return ['draft', 'published'].indexOf(s) > -1;
  });

  this.hasMany('Comments');
  this.belongsTo('User');
};

Post = geddy.model.register('Post', Post);
