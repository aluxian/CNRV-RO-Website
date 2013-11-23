var Menu = function () {
  this.defineProperties({
    name: {type: 'string', required: true}
  });

  this.hasMany('Pages');
};

Menu = geddy.model.register('Menu', Menu);
