/*getDisplayClass = function (type, mode) {
  var config = geddy.config.flash;
  if (mode === "inline" && config.inlineClasses[type] != null) {
    return config.inlineClasses[type];
  }
  if (mode === "block" && config.blockClasses[type] != null) {
    return config.blockClasses[type];
  }
  return config.defaultClass;
};

getDisplayData = function (flash) {
  var messages = flash.messages
    , data = [];
  Object.keys(messages).forEach(function (k) {
    var message = messages[k]
      , described = describe(message);
    data.push({
      message: message
    , heading: k.charAt(0).toUpperCase() + k.slice(1)
    , description: described.text
    , isInline: described.mode === "inline"
    , isBlock: described.mode === "block"
    , displayClass: getDisplayClass(k, described.mode)
    });
  });
  return data;
};

exports.renderFlash = function (flash) {
  var markup = ''
    , flashes = getDisplayData(flash);
  markup += '<div id="flash-container">';
  for (var i = 0, ii = flashes.length; i < ii; i++) {
    markup += '<div class="' + flashes[i].displayClass + '">';
    markup += '<button type="button" class="close" data-dismiss="alert">&times;</button>';
    if (flashes[i].isInline) {
      markup += '<strong>' + flashes[i].heading + ':</strong>&nbsp;';
    }
    else {
      markup += '<h4>' + flashes[i].heading + '</h4>';
    }
    markup +=  flashes[i].description;
    markup += '</div>';
  }
  markup += '</div>';
  markup += '<script type="text/javascript">'
  markup += '$("#flash-container .alert").alert();'
  markup += '</script>';

  return markup;
};
*/