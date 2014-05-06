// Based on parseUri 1.2.2 by
// Steven Levithan <stevenlevithan.com>
// MIT License
module.exports = function(str) {
  var keys = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
      parser = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
      q = { name: 'queryKey', parser: /(?:^|&)([^&=]*)=?([^&]*)/g },
      matches = parser.exec(str),
      uri = {},
      i = 14;

  while (i--) {
    uri[keys[i]] = matches[i] || '';
  }

  uri[q.name] = {};
  uri[keys[12]].replace(q.parser, function ($0, $1, $2) {
    if ($1) {
      uri[q.name][$1] = $2;
    }
  });

  return uri;
};
