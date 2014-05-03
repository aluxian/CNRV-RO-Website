(function($,sr){
  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function(func, threshold, execAsap) {
    var timeout;

    return function debounced () {
      var obj = this, args = arguments;
      function delayed () {
        if (!execAsap) {
          func.apply(obj, args);
        }
        timeout = null;
      };

      if (timeout) {
        clearTimeout(timeout);
      } else if (execAsap) {
        func.apply(obj, args);
      }

      timeout = setTimeout(delayed, threshold || 100);
    };
  };

  // smartresize
  jQuery.fn[sr] = function(fn) {
    return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
  };
})(jQuery, 'smartresize');

$(function() {
  // Run the WYSIWYG editor
  $('#editor').wysiwyg();

  // Prevent the input from closing the dropdown
  $('#add-link-input, #add-pic-input').click(function(event) {
    event.stopPropagation();
  });

  // Copy content from the editor box to a hidden input to be sent as a POST param
  $('#transferContent').click(function(event) {
    $('#postValue').val($('#editor').html());
  });

  // Disable bootstrap's menu item click handler
  $('.disabled-open').click(function(event) {
    event.preventDefault();
  });

  // Responsive menu fix
  var mobileElemsDisable = $('.responsive-disable');
  var blogElem = mobileElemsDisable.first();
  var userElem = mobileElemsDisable.last();
  var userUrl = $('.responsive-disable').last().attr('href');

  var resizeListener = function() {
    var width = $(window).width();
    if (width <= 992) {
      mobileElemsDisable.removeClass('disabled');
      blogElem.removeAttr('href');
      if (userElem.text() != 'Log in cu Facebook') {
        userElem.removeAttr('href');
      }
    } else {
      mobileElemsDisable.addClass('disabled');
      blogElem.attr('href', '/');
      if (userElem.text() != 'Log in cu Facebook') {
        userElem.attr('href', userUrl);
      }
    }
  };

  $(window).smartresize(resizeListener, 1000);
  resizeListener();

  // Set default in datetime inputs
  var dt = new Date();
  dt.setHours(0);
  dt.setMinutes(-dt.getTimezoneOffset());
  dt.setSeconds(0);
  dt.setMilliseconds(0);
  dt = dt.toISOString();
  dt = dt.substring(0, 19);
  $('[type="datetime-local"]').attr('value', dt);
});

// Google Map initializer
if (window.google) {
  google.maps.event.addDomListener(window, 'load', function() {
    var myLatlng = new google.maps.LatLng(46.925460, 26.931390);
    var mapOptions = {
      center: myLatlng,
      zoom: 16
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map
    });
  });
}
