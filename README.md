Readmore.js
========

A smooth, lightweight jQuery plugin for collapsing and expanding long blocks of text with "Read more" and "Close" links. 

The required markup for Readmore.js is also extremely lightweight and very simple. No need for complicated sets of `div`s or hardcoded class names, just call ``.readmore()`` on the element containing your block of text and Readmore.js takes care of the rest.

## Example ##

    $('article').readmore();
  
Yes, it's that simple. You can change the speed of the animation, the height of the collapsed block, and the open and close elements.

    $('article').readmore({
      speed: 75,
      maxHeight: 500
    });

## The options: ##

* `speed: 100` (in milliseconds)
* `maxHeight: 200`  (in pixels)
* `moreLink: '<a href="#">Read more</a>'`
* `lessLink: '<a href="#">Close</a>'`
* `beforeToggle: function() {}` (called after a more or less link is clicked, but *before* the block is collapsed or expanded)
* `afterToggle: function() {}` (called *after* the block is collapsed or expanded)

If the element has a `max-height` CSS property, Readmore.js will use that value rather than the value of the `maxHeight` option.

### The callbacks:

The callback functions, `beforeToggle()` and `afterToggle`, both receive the same arguments: `trigger`, `element`, and `more`.

* `trigger`: the "Read more" or "Close" element that was clicked
* `element`: the block that is being collapsed or expanded
* `more`: Boolean; `true` means the block is expanded

#### Callback example:

Here's an example of how you could use the `afterToggle` callback to scroll back to the top of a block when the "Close" link is clicked.

```javascript
$('article').readmore({
  afterToggle: function(trigger, element, more) {
    if(! more) { // The "Close" link was clicked
      $('html, body').animate( { scrollTop: element.offset().top }, {duration: 100 } );
    }
  }
});
```