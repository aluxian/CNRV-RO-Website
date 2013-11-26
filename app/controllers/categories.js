var async = require('async')
  , utils = require('../modules/utils');

var Categories = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Category.all(function(err, categories) {
      self.respondWith(categories, {type:'Category'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , category = geddy.model.Category.create(params);

    if (!category.isValid()) {
      this.respondWith(category);
    } else {
      category.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(category, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    new geddy.controller.Posts().index.bind(this)(req, resp, params, {categoryId: params.id}, {template: 'app/views/categories/show'});
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Category.first(params.id, function(err, category) {
      if (err) {
        throw err;
      }
      if (!category) {
        throw new geddy.errors.BadRequestError();
      } else {
        self.respondWith(category);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Category.first(params.id, function(err, category) {
      if (err) {
        throw err;
      }
      category.updateProperties(params);

      if (!category.isValid()) {
        self.respondWith(category);
      } else {
        category.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(category, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Category.first(params.id, function(err, category) {
      if (err) {
        throw err;
      }
      if (!category) {
        throw new geddy.errors.BadRequestError();
      } else {
        geddy.model.Category.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(category);
        });
      }
    });
  };

};

exports.Categories = Categories;
