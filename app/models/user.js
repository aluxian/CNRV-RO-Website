var User = function () {
  this.defineProperties({
    username: {type: 'string', required: true},
    password: {type: 'string', required: true},
    familyName: {type: 'string'},
    givenName: {type: 'string'},
    email: {type: 'string', required: true},
    role: {type: 'string', required: true},
    avatar: {type: 'string'}
  });

  // Check that 'role' is valid
  this.validatesWithFunction('role', function (s) {
    return ['admin', 'author', 'user'].indexOf(s) > -1;
  });

  this.validatesLength('username', {min: 3});
  this.validatesLength('password', {min: 3});

  this.hasMany('Passports');
  this.hasMany('Posts');
  this.hasMany('Comments', {through: 'Posts'});
};

User = geddy.model.register('User', User);
