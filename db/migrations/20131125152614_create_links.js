var CreateLinks = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('name', 'string');
          t.column('url', 'string');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('link', def, callback);
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
    this.dropTable('link', callback);
  };
};

exports.CreateLinks = CreateLinks;
