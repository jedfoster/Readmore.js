# Readmore.js

A smooth, responsive JavaScript plugin for collapsing and expanding long blocks of text with "Read more" and "Close" links.

The markup Readmore.js requires is so simple, you can probably use it with your existing HTML—there's no need for complicated sets of `div`s or hardcoded classes, just call `new Readmore()` on the element containing your block of text and Readmore.js takes care of the rest. Readmore.js works well on mobile and plays nicely with responsive designs, too.

Readmore.js has no external dependencies (no more jQuery—yay!) and works in evergreen browsers (current Chrome, Firefox, Safari and Edge). Internet Explorer is not supported.


## Install

Install Readmore.js with npm:

```
$ npm install readmore-js
```

Then include it in your HTML:

```html
<script src="/node_modules/readmore-js/dist/readmore.js"></script>
```

Or, with a bundler:

```javascript
import Readmore from 'readmore-js';

// or, with CommonJS
const Readmore = require('readmore-js');
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

* `speed: 100` in milliseconds. The animation is turned off for visitors who prefer reduced motion (`prefers-reduced-motion: reduce`), checked on every toggle
* `collapsedHeight: 200` in pixels; also accepts a function that receives the block and returns a height in pixels. It's called when the block is set up and whenever it's re-measured. A function wins over a CSS `max-height`, which wins over a number
* `heightMargin: 16` in pixels, avoids collapsing blocks that are only slightly larger than `collapsedHeight`
* `moreLink: '<a href="#">Read More</a>'` HTML string for the "more" toggle link; also accepts a callback function that returns an HTML string
* `lessLink: '<a href="#">Close</a>'` HTML string for the "less" toggle link; also accepts a callback function that returns an HTML string
* `embedCSS: true` insert the `blockCSS` rule dynamically, set this to `false` to style blocks in your own stylesheet instead
* `blockCSS: 'display: block; width: 100%;'` sets the styling of the blocks, ignored if `embedCSS` is `false`
* `startOpen: false` do not immediately truncate, start in the fully opened position
* `sourceOrder: 'after'` the toggle link is inserted `'before'` or `'after'` the block
* `blockProcessed: function() {}` called once per block during initialization after Readmore.js has processed the block
* `beforeToggle: function() {}` called after a more or less link is clicked, but *before* the block is collapsed or expanded
* `afterToggle: function() {}` called *after* the block is collapsed or expanded

If the element has a `max-height` CSS property, Readmore.js will use that value rather than the value of a numeric `collapsedHeight` option. The `max-height` is read again each time the block is re-measured, so a value that changes with a media query follows the viewport.

Readmore.js re-measures a block whenever its width changes and once the page has loaded, so the fold follows text that re-wraps.


### Callbacks

#### Toggle link callbacks

You can pass a callback function instead of an HTML string for the `moreLink` and `lessLink` options. This is useful if you want to alter the content of more/less toggle links on a per block basis. Your callback will receive the current block and _must_ return a string.

Here's how you could use a callback to dynamically generate a `moreLink` containing the headline of a block.

```javascript
new Readmore('article', {
  moreLink: function(element) {
    const headline = element.querySelector('h2').innerText;

    return `<a href="#">Read more about ${headline}</a>`;
  }
});
```

#### Lifecycle callbacks

The `beforeToggle` and `afterToggle` callbacks both receive the same arguments: `trigger`, `element`, and `expanded`.

* `trigger`: the "Read more" or "Close" element that was clicked
* `element`: the block that is being collapsed or expanded
* `expanded`: Boolean; `true` means the block is expanded. `beforeToggle` gets the state before the toggle, `afterToggle` the state after it

With `speed: 0`, or when the visitor prefers reduced motion, `afterToggle` fires right away instead of when the animation ends.

The `blockProcessed` callback receives `element` and `collapsible`.

* `element`: the block that has just been processed
* `collapsible`: Boolean; `false` means the block was shorter than the specified minimum `collapsedHeight`, so it will not have a "Read more" link

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

If `beforeToggle` returns `false` the toggle action is halted and `afterToggle` will _not_ be executed. This is useful if you want to prevent a toggle based on some application logic—the state of another element on the page, current phase of the moon, etc.


## API

The `Readmore` class constructor and all methods accept as arguments, either:

* `selector String` valid CSS selectors; e.g. `'blockquote'`, `'.truncate-block'`, or `'#blog .section'`
* `Element` a single Element object; e.g. return value of `document.getElementById('blog')`
* `NodeList` a NodeList collection of Elements; e.g. return value of `document.querySelectorAll('article')`

### Constructor

```javascript
new Readmore(selector String | Element | NodeList, options Object);
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

When invoked with no argument or `null`, will remove Readmore.js functionality from all of the instance's blocks. Each block gets back the `max-height` it had before, so you can call `new Readmore()` on it again.

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


## CSS

Readmore.js needs no stylesheet. The collapsed height comes from the `max-height` property or the `collapsedHeight` option, and each block gets `overflow: hidden` and a `height` transition (from `speed`) as inline styles.

Folded blocks get a `data-readmore` attribute and their toggles get `data-readmore-toggle`, which make handy styling hooks. Each toggle also carries `aria-controls`, pointing at its block, and `aria-expanded`, with the block's current state.

By default, Readmore.js also inserts the following CSS, which comes from the `blockCSS` option:

```css
selector + [data-readmore-toggle], selector[data-readmore] {
  display: block;
  width: 100%;
}
```

_`selector` is the selector string you passed to `new Readmore()`. When you pass an Element or NodeList, Readmore.js generates a class for the instance and uses that instead._

You can override the base rules when you set up Readmore.js like so:

```javascript
new Readmore('article', { blockCSS: 'display: inline-block; width: 50%;' });
```

If you'd rather put that styling in your site's stylesheet, set `embedCSS` to `false` and Readmore.js won't add a `<style>` element at all:

```javascript
new Readmore('article', { embedCSS: false });
```

Because the transition is inline, a site's own `transition` rule on `[data-readmore]` needs `!important` to win.

### Media queries and other CSS tricks

If you wanted to set a `max-height` based on lines, you could do so in CSS with something like:

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

Pull requests should include tests for your change, and this readme should be updated with a description of your new feature.

You'll need Node 24 or later. Install the development dependencies, and the browsers the tests run in:

```
$ npm install
$ npx playwright install
```

Then, to build `dist/`:

```
$ npm run build
```

To run the unit tests, then the browser tests in Chromium, Firefox and WebKit:

```
$ npm test
```

Or work on the demo page at http://localhost:9000, rebuilding as you go:

```
$ npm start
```
