var Passports = function () {
  
  this.respondsWith = ['html', 'json'];

  this.index = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    // Save the resource, then display index page
    this.redirect({controller: this.name});
  };

  this.update = function (req, resp, params) {
    // Save the resource, then display the item page
    this.redirect({controller: this.name, id: params.id});
  };

  this.add = this.show = this.edit = this.destroy = this.index;

};

exports.Passports = Passports;
