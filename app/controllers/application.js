var Handlebars = require('handlebars')
  , moment = require('moment')
  , utils = require('../modules/utils')
  , _ = require('underscore');

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

  /* Render pager for the provided params */
  Handlebars.registerHelper('renderPager', function(page, max, options) {
    page = parseInt(page) || 0;
    max = (parseInt(max) || 0) / 10 - 1;

    var html = '<li class="previous' + (page >= max ? ' disabled' : '') + '"><a'
      + (page < max ? ' href="?page=' + ((page || 0) + 1) + '"' : '') + '>&larr; Postari anterioare</a></li>'
      + '<li class="next' + (page ? '' : ' disabled') + '"><a' + (page ? ' href="?page=' + (page - 1) + '"' : '')
      + '>Postari noi &rarr;</a></li>';

    return html;
  });

  /* Render resource actions widget */
  Handlebars.registerHelper('renderResActions', function(user, params, options) {
    if (params.action != 'show' || !user) {
      return '';
    }

    var resName = params.controller.toLowerCase();
    var resSing = geddy.inflection.singularize(params.controller);
    return '<div class="widget res-actions"><h3>' + resSing + ' actions</h3>'
      + '<ul><form action="/' + resName + '/' + params.id + '?_method=DELETE" method="POST">'
      + '<button type="submit" class="btn btn-danger">Delete</button></form>'
      + '<a href="/' + resName + '/' + params.id + '/edit" class="btn btn-inverse">Edit</a>'
      + '<a href="/' + resName + '/add" class="btn btn-inverse">Write new ' + resSing.toLowerCase() + '</a></ul></div>';
  });

  /* Render flash messages */
  Handlebars.registerHelper('renderFlash', function(flash, options) {
    var html = '<script>setTimeout(function(){$(function(){';
    
    _.each(flash.messages, function(message, type) {
      html += '$.bootstrapGrowl("' + message + '", {offset: {from: "top", amount: 75}, type: "' + type + '"});';
    });

    return html + '});}, 2000);</script>';
  });
};

exports.Application = Application;
