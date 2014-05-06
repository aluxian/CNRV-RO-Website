var geddy = require('geddy');

geddy.startCluster({
  environment: process.env.NODE_ENV || 'development'
});
