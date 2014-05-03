var Event = function () {
  this.defineProperties({
    name: {type: 'string', required: true},
    description: {type: 'string'},
    dateStart: {type: 'datetime', required: true},
    dateEnd: {type: 'datetime', required: true}
  });
};

Event = geddy.model.register('Event', Event);
