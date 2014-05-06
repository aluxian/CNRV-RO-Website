var Handlebars = require('handlebars')
  , moment = require('moment')
  , utils = require('../modules/utils')
  , _ = require('underscore');

// Set MomentJS language
moment.lang('ro');

var Application = function () {
  /* Name requests so that they do not all get grouped under /* or similar in New Relic */
  if (process.env.NODE_ENV == 'production') {
    this.before(function() {
      geddy.newrelic.setControllerName(this.params.controller, this.params.action);
    });
  }

  /* Set the previous visited page for redirect after login */
  this.before(function() {
    if (['Auth', 'Main'].indexOf(this.session.controller.name) == -1) {
      this.session.set('lastVisitUrl', this.session.controller.url);
    }
  });

  /* Return the singular form if no equals 1, plural otherwise */
  Handlebars.registerHelper('singOrPlural', function(no, singular, plural, options) {
    return no == 1 ? singular : plural;
  });

  /* Format time to be shown in posts */
  Handlebars.registerHelper('timeToPostFormat', function(time, options) {
    return moment(time).format('LL');
  });

  /* Format time to be shown on the events edit page */
  Handlebars.registerHelper('timeToEventFormat', function(time, options) {
    time = moment(time);
    if (time.minutes() == 0 && time.hours() == 0) {
      return time.format('LL');
    } else {
      return time.format('lll');
    }
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

    if (page >= max && !page) {
      return '';
    }

    var html = '<li class="previous' + (page >= max ? ' disabled' : '') + '"><a'
      + (page < max ? ' href="?page=' + ((page || 0) + 1) + '"' : '') + '>&larr; Postări anterioare</a></li>'
      + '<li class="next' + (page ? '' : ' disabled') + '"><a' + (page ? (page > 1 ? ' href="?page=' + (page - 1)
      + '"' : ' href="/"') : '') + '>Postări noi &rarr;</a></li>';

    return html;
  });

  /* Render resource actions widget */
  Handlebars.registerHelper('renderResActions', function(user, params, root, options) {
    var userHasAccessToEdit = (root.root.post && root.root.post.userHasAccessToEdit) || (root.root.page && root.root.page.userHasAccessToEdit);
    var controllerIsOk = params.controller == 'Posts' || params.controller == 'Pages';

    if (!user || params.action != 'show' || !controllerIsOk || !userHasAccessToEdit) {
      return '';
    }

    var resName = params.controller.toLowerCase();
    return '<div class="widget res-actions">'
      + '<ul><form action="/' + resName + '/' + params.id + '?_method=DELETE" method="POST">'
      + '<button type="submit" class="btn btn-danger">Șterge</button></form>'
      + '<a href="/' + resName + '/' + params.id + '/edit" class="btn btn-inverse">Editează</a></ul></div>';
  });

  /* Render flash messages */
  Handlebars.registerHelper('renderFlash', function(flash, options) {
    var html = '<script>setTimeout(function(){$(function(){';

    _.each(flash.messages, function(message, type) {
      if (type == 'error') {
        type = 'danger';
      }
      html += '$.bootstrapGrowl("' + message + '", {offset: {from: "top", amount: 75}, type: "' + type + '"});';
    });

    return html + '});}, 500);</script>';
  });

  /* Transform the avatar url to change size */
  Handlebars.registerHelper('avatarScaleForProfilePage', function(url, options) {
    url = url.replace(/width=100/g, 'width=360');
    url = url.replace(/height=100/g, 'height=256');
    return url;
  });
};

exports.Application = Application;
