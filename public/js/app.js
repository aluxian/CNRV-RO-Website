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

  // Focus on the input when the Add hyperlink button is clicked
  $('.add-link-icon').click(function() {
    $('#add-link-input').focus();
  });

  // Focus on the input when the Add pic button is clicked
  $('.add-pic-icon').click(function() {
    $('#add-pic-input').focus();
  });
});
