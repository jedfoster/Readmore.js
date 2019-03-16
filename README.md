# Readmore.js -- v3.0.0-beta

A smooth, responsive JavaScript plugin for collapsing and expanding long blocks of text with "Read more" and "Close" links.

The markup Readmore.js requires is so simple, you can probably use it with your existing HTML—there's no need for complicated sets of `div`s or hardcoded classes, just call `new Readmore()` on the element containing your block of text and Readmore.js takes care of the rest. Readmore.js works well on mobile and plays nicely with responsive designs, too.

Readmore.js has no external dependencies (no more jQuery—yay!) and works in all the "good" browsers, as well as IE10+; IE9 _should_ work, but is not supported and the experience will not be ideal.


**NOTE: This documentation is for the beta releases of the next version of Readmore.js.**


## Install

Install Readmore.js with npm:

```
$ npm install readmore-js@next
```

Then include it in your HTML:

```html
<script src="/node_modules/readmore-js/dist/readmore.js"></script>
```

Or, using Webpack or Browserify:

```javascript
require('readmore-js');
```


## Usage

```javascript
new Readmore('article');
```

It's that simple. You can change the speed of the animation, the height of the collapsed block, and the open and close elements.

```javascript
new Readmore('article', {
  speed: 75,
  lessLink: '<a href="#">Read less</a>'
});
```


## Options

* `speed: 100` in milliseconds
* `collapsedHeight: 200` in pixels
* `heightMargin: 16` in pixels, avoids collapsing blocks that are only slightly larger than `collapsedHeight`
* `moreLink: '<a href="#">Read more</a>'` HTML string for the "more" toggle link; also accepts a callback function that returns an HTML string
* `lessLink: '<a href="#">Close</a>'` HTML string for the "less" toggle link; also accepts a callback function that returns an HTML string
* `embedCSS: true` insert required CSS dynamically, set this to `false` if you include the necessary CSS in a stylesheet
* `blockCSS: 'display: block; width: 100%;'` sets the styling of the blocks, ignored if `embedCSS` is `false`
* `startOpen: false` do not immediately truncate, start in the fully opened position
* `sourceOrder: 'after'` the toggle link is inserted `'before'` or `'after'` the block
* `blockProcessed: function() {}` called once per block during initilization after Readmore.js has processed the block
* `beforeToggle: function() {}` called after a more or less link is clicked, but *before* the block is collapsed or expanded
* `afterToggle: function() {}` called *after* the block is collapsed or expanded

If the element has a `max-height` CSS property, Readmore.js will use that value rather than the value of the `collapsedHeight` option.


### Callbacks

#### Toggle link callbacks

You can pass a callback function instead of an HTML string for the `moreLink` and `lessLink` options. This is useful if you want alter the content of more/less toggle links on a per block basis. Your callback will receive the current block and _must_ return a string.

Here's how you could use a callback to dynamically generate a `moreLink` containing the headline of a block.

```javscript
new Readmore('article', {
  moreLink: function(element) {
    const headline = element.querySelector('h2').innerText;

    return `<a href="#">Read more about ${headline}</a>`;
  }
};
```

#### Lifecycle callbacks

The `beforeToggle` and `afterToggle` callbacks both receive the same arguments: `trigger`, `element`, and `expanded`.

* `trigger`: the "Read more" or "Close" element that was clicked
* `element`: the block that is being collapsed or expanded
* `expanded`: Boolean; `true` means the block is expanded

The `blockProcessed` callback receives `element` and `collapsible`.

* `element`: the block that has just been processed
* `collapsible`: Boolean; `false` means the block was shorter than the specified minimum `collapsedHeight`--the block will not have a "Read more" link

Here's an example of how you could use the `afterToggle` callback to scroll back to the top of a block when the "Close" link is clicked.

```javascript
new Readmore('article', {
  afterToggle: function(trigger, element, expanded) {
    if(!expanded) { // The "Close" link was clicked
      window.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
    }
  }
});
```

If `beforeToggle` returns `false` the toggle action is halted and `afterToggle` will _not_ be executed. This is useful if you want prevent a toggle based on some application logic--the state of another element on the page, current phase of the moon, etc.


## API

The `Readmore` class constructor and all methods accept as arguments, either:

* `selector String` valid CSS selectors; e.g. `'blockquote'`, `'.truncate-block'`, or `'#blog .section'`
* `Element` a single Element object; e.g. return value of `document.getElementById('blog')`
* `NodeList` a NodeList collection of Elements; e.g. return value of `document.querySelectorAll('article')`

### Constructor

```javascript
new Readmore(selector String | Element | NodeList);
```

### toggle

Toggle a block programmatically.

```javascript
// As instance method
rmjs.toggle(selector String | Element | NodeList);
```

You can toggle a block from code:

```javascript
// Store a reference to an instance of Readmore
var rmjs = new Readmore('article');

rmjs.toggle('article:first-child')
```

### destroy

Remove Readmore.js functionality from specific blocks or all blocks.

```javascript
rmjs.destroy(null | selector String | Element | NodeList);
```

When invoked with `null`, will remove Readmore.js functionality from all of the instance's blocks.

You can remove the Readmore.js functionality like so:

```javascript
// Store a reference to an instance of Readmore
var rmjs = new Readmore('article');

// Now call destroy on the instance
rmjs.destroy();
```

Or, you can be more surgical by specifying a particular element:

```javascript
// Store a reference to an instance of Readmore
var rmjs = new Readmore('article');

// Now remove Readmore from just the first block
rmjs.destroy(document.querySelector('article:first-child'));

// or
rmjs.destroy('article:nth-of-type(2)');
```


## CSS:

Readmore.js is designed to use CSS for as much functionality as possible: collapsed height can be set in CSS with the `max-height` property; "collapsing" is achieved by setting `overflow: hidden` on the containing block and changing the `height` property; and, finally, the expanding/collapsing animation is done with CSS3 transitions.

By default, Readmore.js inserts the following CSS, in addition to some transition-related rules:

```css
selector + [data-readmore-toggle], selector[data-readmore] {
  display: block;
  width: 100%;
}
```

_`selector` would be the element you invoked `readmore()` on, e.g.: `new Readmore('selector')`_

You can override the base rules when you set up Readmore.js like so:

```javascript
new Readmore('article', { blockCSS: 'display: inline-block; width: 50%;' });
```

If you want to include the necessary styling in your site's stylesheet, you can disable the dynamic embedding by setting `embedCSS` to `false`:

```javascript
new Readmore('article', { embedCSS: false });
```

### Media queries and other CSS tricks:

If you wanted to set a `maxHeight` based on lines, you could do so in CSS with something like:

```css
body {
  font: 16px/1.5 sans-serif;
}

/* Show only 4 lines in smaller screens */
article {
  max-height: 6em; /* (4 * 1.5 = 6) */
}
```

Then, with a media query you could change the number of lines shown, like so:

```css
/* Show 8 lines on larger screens */
@media screen and (min-width: 640px) {
  article {
    max-height: 12em;
  }
}
```


## Contributing

Pull requests are always welcome, but not all suggested features will get merged. Feel free to contact me if you have an idea for a feature.

Pull requests should include the minified script and this readme and the demo HTML should be updated with descriptions of your new feature.

You'll need NPM:

```
$ npm install
```

Which will install the necessary development dependencies. Then, to build the minified script:

```
$ npm run build
```
