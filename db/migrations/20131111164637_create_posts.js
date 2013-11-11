var CreatePosts = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('title', 'string');
          t.column('content', 'text');
          t.column('status', 'string');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('post', def, callback);
  };

  this.down = function (next) {
    var callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.dropTable('post', callback);
  };
};

exports.CreatePosts = CreatePosts;
