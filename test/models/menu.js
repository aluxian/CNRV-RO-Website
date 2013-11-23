var assert = require('assert')
  , tests
  , Menu = geddy.model.Menu;

tests = {

  'after': function (next) {
    // cleanup DB
    Menu.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var menu = Menu.create({});
    menu.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
