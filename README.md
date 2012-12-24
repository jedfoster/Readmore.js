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

If the element has a `max-height` CSS property, Readmore.js will use that value rather than the value of the `maxHeight` option.