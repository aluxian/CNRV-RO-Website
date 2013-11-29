$(function() {
  // Run the WYSIWYG editor
  // TODO: Only run when user is on an edit page
  $('#editor').wysiwyg();

  // Prevent the input from closing the dropdown
  // TODO: same as above
  $('#add-link-input, #add-pic-input').click(function(event) {
    event.stopPropagation();
  });

  // Copy content from the editor box to a hidden input to be sent as a POST param
  // TODO only run on edit page
  $('#transferContent').click(function(event) {
    $('#postValue').val($('#editor').html());
  });
});

// Google Map initializer
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
