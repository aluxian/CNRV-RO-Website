var config = {
  detailedErrors: true
, debug: true
, hostname: null
, port: 4000
, model: {
    defaultAdapter: 'mongo'
  }
, db: {
    mongo: {
      username: null
    , dbname: 'dev'
    , prefix: null
    , password: null
    , host: 'localhost'
    , port: 27017
    }
  }
, sessions: {
    store: 'memory'
  , key: 'sid'
  , expiry: 14 * 24 * 60 * 60
  }
};

module.exports = config;
