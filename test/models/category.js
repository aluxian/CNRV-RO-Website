var assert = require('assert')
  , tests
  , Category = geddy.model.Category;

tests = {

  'after': function (next) {
    // cleanup DB
    Category.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var category = Category.create({});
    category.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
