var config = {
  detailedErrors: true
, debug: true
, hostname: process.env.HOSTNAME || '0.0.0.0'
, port: process.env.PORT || 4000
, model: {
    defaultAdapter: 'mongo'
  }
, db: {
    mongo: {
      username: null
    , dbname: 'cnrv'
    , prefix: null
    , password: null
    , host: 'localhost'
    , port: 27017
    }
  }
, sessions: {
    store: 'memory'
  , key: 'cnrv_sid'
  , expiry: 14 * 24 * 60 * 60
  }
};

module.exports = config;
