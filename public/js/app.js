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
