var assert = require('assert')
  , tests
  , Link = geddy.model.Link;

tests = {

  'after': function (next) {
    // cleanup DB
    Link.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var link = Link.create({});
    link.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
