var Link = function () {
  this.defineProperties({
    linkType: {type: 'string', required: true},
    url: {type: 'string', required: true},
    src: {type: 'string'},
    name: {type: 'string', required: true}
  });

  // Check that 'linkType' is valid
  this.validatesWithFunction('linkType', function (s) {
    return ['url', 'img'].indexOf(s) > -1;
  });
};

Link = geddy.model.register('Link', Link);
