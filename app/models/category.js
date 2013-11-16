var Category = function () {
  this.defineProperties({
    name: {type: 'string', required: true}
  });

  this.hasMany('Posts');
};

Category = geddy.model.register('Category', Category);
