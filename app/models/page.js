var Page = function () {
  this.defineProperties({
    title: {type: 'string', required: true},
    content: {type: 'text', required: true},
    status: {type: 'string', required: true}
  });

  // Check that 'status' is valid
  this.validatesWithFunction('status', function (s) {
    return ['draft', 'published'].indexOf(s) > -1;
  });

  this.belongsTo('Menu');
};

Page = geddy.model.register('Page', Page);
