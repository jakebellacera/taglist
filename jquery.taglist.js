(function ($) {
  var Taglist = function (input, options) {
    var self = this,
        onTagItemClick,
        onUserInputKeydown;

    self.settings = $.extend({
      confirmRemove: true

      // these callbacks are available:
      //   errorTagAlreadyExists
    }, options);
    
    // Sets up everything.
    // 
    // Returns void.
    self.init = function () {

      // fetch any tags that may currently exist
      var tags = input.val() !== '' ? input.val().replace(/\s/, '').split(',') : [];

      // set some things
      self.userInput = input;
      self.tags = [];
      self.container = $('<div class="taglist-container"/>')
                         .insertAfter(self.input);

      // make the actual tag field hidden and set the text field to just be used
      // for the front-end.
      self.input = $('<input type="hidden"/>')
                     .attr({
                       'name': self.userInput.attr('name')
                     })
                     .prependTo(self.container);
      self.userInput.attr('name', '').val('');

      // append the taglist listing to the container
      self.container.append($('<div class="taglist-listing"/>'));

      // bind stuff
      self.container.on('click.taglist', 'a', function (e) {
        e.preventDefault();

        if (!self.settings.confirmRemove || confirm('Are you sure you want to remove this tag?')) {
          self.removeTag($(this).text());
        }
      });

      self.userInput.on('keydown.taglist', function (e) {
        if (e.which === 13 || e.which === 188) { // enter key or comma key
          e.preventDefault();

          if (self.addTag(self.userInput.val())) {
            self.userInput.val(""); // reset the input field
          } else {
            if (typeof self.settings.errorTagAlreadyExists === 'function') {
              self.settings.errorTagAlreadyExists.call(self);
            } else {
              alert('Error: That tag already exists!');
            }
          }
        }
      });

      // add tags
      if (tags.length > 0) {
        $.each(tags, function (i, tag) {
          self.addTag(tag);
        });
      }
    };

    // Adds a tag by name
    // 
    // Returns true if it was added, false if it wasn't.
    self.addTag = function (tagName) {
      if (typeof tagName !== 'string') return false;

      tagName = $.trim(tagName);

      if ($.inArray(tagName, self.tags) !== -1) return false;

      // add it to the tag listing
      self.tags.push(tagName);
      self.container
        .find('.taglist-listing')
          .append($('<a href="#" class="taglist-tag">' + tagName + '</a>'));

      updateInputValue();

      return true;
    };

    // Removes a tag by name
    // 
    // Returns true if it was removed, false if it wasn't.
    self.removeTag = function (tagName) {
      if (typeof tagName !== 'string') return false;

      var tagIndex;

      tagName = $.trim(tagName);
      tagIndex = $.inArray(tagName, self.tags);

      if (tagIndex === -1) return false;

      // remove the tag from the tag listing
      self.tags.splice(tagIndex, 1);
      self.container
        .find('.taglist-listing')
          .children()
            .eq(tagIndex)
              .remove();

      updateInputValue();

      return true;
    };


    // Private methods

    // Updates the hidden input's value.
    // 
    // Returns void.
    updateInputValue = function () {
      self.input.val(self.tags.join(','));
    };
    
    // Start the damn thing!
    self.init();
    
    return self;
  };
  
  $.fn.taglist = function (options) {
    return this.each(function () {
      if (!$(this).data('taglist'))
        $(this).data('taglist', new Taglist($(this), options)); 
    });
  };
}(jQuery));
