/*
jQuery.taglist
==============
Version: 0.1
Docs:    http://github.com/jakebellacera/taglist
Author:  Jake Bellacera (http://jakebellacera.com)
*/

(function ($) {
  var Taglist = function (input, options) {
    var self = this,
        updateInputValue,
        TaglistError;

    self.settings = $.extend({
      confirmRemove: true,
      ignoreCaseWhenAdding: false,
      regex: /.*/

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
                         .insertAfter(self.userInput);

      // Pull the pattern off of the input element itself if it's set
      if (self.userInput.attr('pattern')) {
        self.settings.regex = new RegExp(self.userInput.attr('pattern'));
      }

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
          if (!(e.which === 13 && self.userInput.val() === '')) {
            try {
              if (self.addTag(self.userInput.val())) self.userInput.val(""); // reset the input field
            } catch (error) {
              if (error.name === 'errorTagAlreadyExists' && typeof self.settings.errorTagAlreadyExists === 'function') {
                self.settings.errorTagAlreadyExists.call(self);
              } else {
                alert(error.message);
                if (e.which === 188) $(this).val($(this).val().slice(0,-1)); // get rid of that trailing comma
              }
            }

            e.preventDefault();
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
      var tags = self.tags;

      // Check if the tag is a string
      if (typeof tagName !== 'string') {
        throw new TaglistError('Type', 'The tag name must be a string.');
        return false;
      }

      // remove whitespace from the tag
      tagName = $.trim(tagName);

      // if we need to ignore case, just lowercase everything for the test
      if (!self.settings.ignoreCaseWhenAdding) tags = $.map(self.tags, function (t) { return t.toLowerCase(); });

      // Check if the tag passes the regex test
      if (!self.settings.regex.test(tagName)) {
        throw new TaglistError('InvalidTagName', 'The tag "' + tagName + '" is invalid.');
        return false;
      }

      // Check if the tag already exists
      if ($.inArray( (!self.settings.ignoreCaseWhenAdding ? tagName.toLowerCase() : tagName), tags ) !== -1) {
        throw new TaglistError('TagAlreadyExists', 'The tag "' + tagName + '" already exists.');
        return false;
      }

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

    // Taglist error message object
    TaglistError = function (name, message) {
      this.message = message;
      this.name = 'Taglist' + name + 'Error';
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
