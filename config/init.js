var cluster = require('cluster')
  , url = require('url');

// If in production mode start the New Relic monitor
if (cluster.isWorker && process.env.NODE_ENV == 'production') {
  process.env.NEW_RELIC_LOG = 'stdout';
  geddy.newrelic = require('newrelic');
}

var init = function(cb) {
  // Add uncaught-exception handler in prod-like environments
  if (geddy.config.environment != 'development') {
    process.addListener('uncaughtException', function (err) {
      var msg = err.message;
      if (err.stack) {
        msg += '\n' + err.stack;
      }
      if (!msg) {
        msg = JSON.stringify(err);
      }
      geddy.log.error(msg);
    });
  }
  cb();
};

exports.init = init;
