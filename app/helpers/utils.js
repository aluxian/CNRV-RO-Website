var utils = {}
  , async = require('async');

/**
 * Fetch the provided models' associated data. Used in async.waterfall
 * @param  models  Array of models to fetch
 * @param  field   Field of the data object to fetch for
 */
utils.fetchAssociations = function(models, field) {
  return function(data, callback) {
    var arrayed, items = data[field] || data;
    if (!(items instanceof Array)) {
      items = [items];
      arrayed = true;
    }

    async.each(items, function(item, callback) {
      async.each(models, function(model, callback) {
        item['get' + model](function(err, modelData) {
          item[model.toLowerCase()] = modelData;
          callback(err);
        });
      }, callback);
    }, function(err) {
      if (arrayed) {
        items = items[0];
      }
      
      if (field) {
        data[field] = items;
      } else {
        data = items;
      }
      
      callback(err, data);
    });
  };
};

module.exports = utils;
