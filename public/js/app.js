$(function() {
  // Run the WYSIWYG editor
  // TODO: Only run when user is on an edit page
  $('#editor').wysiwyg();

  // Prevent the input from closing the dropdown
  // TODO: same as above
  $('#add-link-input').click(function(event) {
    event.stopPropagation();
  });

  // Copy content from the editor box to a hidden input to be sent as a POST param
  // TODO only run on edit page
  $('[name="status"]').click(function(event) {
    $('#postValue').val($('#editor').html());
  });
});
