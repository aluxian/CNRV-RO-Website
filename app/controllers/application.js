/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/
var Handlebars = require('handlebars')
  , moment = require('moment');

// Set MomentJS language
moment.lang('ro');

var Application = function () {
  /* Return the singular for no == 1 and plural otherwise */
  Handlebars.registerHelper('singOrPlural', function(no, singular, plural, options) {
    return no + ' ' + (no == 1 ? singular : plural);
  });

  /* Format time to be shown in posts */
  Handlebars.registerHelper('timeToPostFormat', function(time, options) {
    return moment(time).format('LL');
  });

  /* Convert time to timestamp */
  Handlebars.registerHelper('timeToTimestamp', function(time, options) {
    return moment(time).format('X');
  });

  /* Used for logging */
  Handlebars.registerHelper('log', function(data, options) {
    console.log("HB LOG: ", data);
  });
};

exports.Application = Application;
