var Event = function () {
  this.defineProperties({
    name: {type: 'string', required: true},
    name: {type: 'date', required: true}
  });
};

Event = geddy.model.register('Event', Event);
