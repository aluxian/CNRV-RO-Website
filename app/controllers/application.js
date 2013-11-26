var Handlebars = require('handlebars')
  , moment = require('moment')
  , utils = require('../modules/utils');

// Set MomentJS language
moment.lang('ro');

var Application = function () {
  geddy.config.flash.inlineClasses['form-success'] = 'alert alert-success';
  geddy.config.flash.inlineClasses['form-error'] = 'alert alert-error';

  /* Return the singular form if no equals 1, plural otherwise */
  Handlebars.registerHelper('singOrPlural', function(no, singular, plural, options) {
    return no == 1 ? singular : plural;
  });

  /* Format time to be shown in posts */
  Handlebars.registerHelper('timeToPostFormat', function(time, options) {
    return moment(time).format('LL');
  });

  /* Format time to be shown in comments */
  Handlebars.registerHelper('timeToCommentFormat', function(time, options) {
    return moment(time).format('lll');
  });

  /* Used for logging */
  Handlebars.registerHelper('log', function(data, options) {
    console.log("HB LOG: ", data);
  });

  /* Check if two params are equal */
  Handlebars.registerHelper('ifEqual', function(p1, p2, options) {
    return (p1 == p2) || (parseInt(p1) === parseInt(p2)) ? options.fn() : options.inverse();
  });

  /* Return index of the previous page */
  Handlebars.registerHelper('pagePrev', function(page, max, options) {
    page = parseInt(page);
    max = (parseInt(max) || 0) / 10 - 1;
    return page < max ? ' href="?page=' + ((page || 0) + 1) + '"' : '';
  });

  /* Return index of the next page */
  Handlebars.registerHelper('pageNext', function(page, options) {
    page = parseInt(page);
    return page ? ' href="?page=' + (page - 1) + '"' : '';
  });

  /* Return disabled if there are no more posts */
  Handlebars.registerHelper('pagePrevDisabled', function(page, max, options) {
    page = parseInt(page) || 0;
    max = (parseInt(max) || 0) / 10 - 1;
    return page >= max ? ' disabled' : '';
  });

  /* Return disabled if there are no more posts */
  Handlebars.registerHelper('pageNextDisabled', function(page, options) {
    return parseInt(page) ? '' : ' disabled';
  });
};

exports.Application = Application;
