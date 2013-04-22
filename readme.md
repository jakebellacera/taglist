jQuery.taglist
==============

taglist is a jQuery plugin that lets you convert a plain ol' comma-delimited text field into a super awesome, interactive tag list.

In other words, turn this:

![taglist before](http://i.imgur.com/8GzjU1E.png)

Into this:

![taglist after](http://i.imgur.com/hfOhf9c.png)

Installation
------------

taglist is designed to be a drop-in replacement. Do these three simple steps to get up and running:

1. Add jquery.taglist.js onto your webpage.
2. Add `$('.myTagInputField').taglist();` to your webpage.
3. Add some CSS for your taglist.

Options
-------

Options can be set on your taglist by passing in an object as a parameter like so:

```javascript
$('.myTagInputField').taglist({
  foo: 'bar'
});
```

Currently, there is only one available option:

#### *(bool)* confirmRemove (default: `true`)

Shows a dialog confirming if you'd like to remove the tag or not.

Callbacks
---------

Callbacks are optional functions that are fired after an event. They are set in the options object.

#### errorTagAlreadyExists

Fired when a user attempts to add a tag that already exists. By default, an alert dialog pops up letting the user know that that tag already exists.

***

Contributing
------------

There are two ways you can contribute:

* Fork this repo and apply patches
* Submit bugs/feature requests over at the [Issues section](http://github.com/jakebellacera/taglist/issues). Please be specific by adding your browser type, browser version, and OS when filing a bug.