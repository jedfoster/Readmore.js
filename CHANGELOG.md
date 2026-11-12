# 3.1.0

## New features

- A block is folded or unfolded again whenever it's re-measured. One whose text re-wraps past `collapsedHeight` gets a toggle, and one that no longer needs folding loses it (#248)
- A block that's hidden when Readmore.js starts, in an inactive tab say, is folded once it's shown (#262)
- A `collapsedHeight` function can return `Infinity` to leave a block unfolded, above a breakpoint for example (#255)

## Fixes

- The toggle of a block inside a shadow root now switches between "Read more" and "Close". The embedded `<style>` can't reach a shadow root, so put the `blockCSS` rules in its own styles
- A block created after the page loads expands all the way. It used to stop short by its children's margins
- A block still re-measures when its width changes before the browser's first resize report arrives (WebKit)
- `destroy()` also cleans up blocks that were too short to fold

## Potentially breaking changes

- `blockProcessed` still runs once per block, at setup. A block that's hidden then reports `collapsible: false`, and a later re-measure that folds or unfolds a block doesn't call it again.
- Every block is watched for width changes, not only folded ones.
- `toggle()` on a block that isn't folded does nothing. It used to collapse the block, or throw for a destroyed one.

# 3.0.1

## Fixes

- The README no longer tells you to install the beta from the `next` tag, and its examples and contributing steps match 3.0

# 3.0.0

## New features

- `collapsedHeight` accepts a function, `(element) => number`, which is called at setup and on every re-measure
- Blocks re-measure when their width changes, not only on window resize, using `ResizeObserver`
- The height animation is turned off under `prefers-reduced-motion: reduce`
- Readmore.js has no runtime dependencies

## Fixes

- A block styled with a CSS `max-height` now expands to its full height before any resize
- A CSS `max-height` inside a media query is re-read on resize
- Toggle markup with leading whitespace no longer throws
- `speed: 0` no longer throws when toggling
- A toggle clicked just after page load is no longer undone by the load-time re-measure
- `destroy()` removes Readmore.js's listeners, observer, inline styles and style tag, and gives the block back its own `max-height`, so a new instance can fold it again (#253)
- `afterToggle` now fires when a re-measure (a width change or page load) interrupts the animation
- An inline `max-height` on the block is honored again
- A `collapsedHeight` function may return a numeric string

## Potentially breaking changes

- jQuery is no longer required. Readmore.js is plain JavaScript.
- IE10 and IE11 are no longer supported.
- `aria-expanded` is now on the toggle, not the block. Site CSS or scripts that select `[aria-expanded]` on blocks need updating.
- A CSS `max-height: 0` now collapses the block to 0. It used to fall back to `collapsedHeight`.
- Toggling again before the animation ends fires `afterToggle` once, for the final state.
- Under reduced motion or `speed: 0`, `afterToggle` fires right away.
- With `embedCSS: false`, Readmore.js no longer injects any `<style>`. The height transition and `overflow: hidden` are now inline styles on each block, so a site's own `[data-readmore]` transition needs `!important` to win.

# 2.0.0

## New features

- Install with Bower: `bower install readmore`
- Blocks can now be toggled programmatically: `$('article:nth-of-type(3)').readmore('toggle')`
- ARIA semantics describe expanded state and relationship between blocks and their toggles
- Blocks are now assigned an ID if they don't already have one
- Install development dependencies with NPM
- Gulp task to minifiy with UglifyJS 

## Improvements

- Height calculations on window resize are "debounced", resulting in more efficient rendering
- Height calculation in general has been improved
- The value of the `expanded` argument passed to the `beforeToggle` callback now correctly reflects the _pre-toggle_ state
- Multiple instances are now fully supported: e.g. `$('article').readmore({speed: 200})` and `$('fieldset').readmore({speed: 900})` will work on the same page
- Fully responsive, plugin now prefers max-heights set in CSS, even inside media queries

## Potentially breaking changes

- `maxHeight` option is now `collapsedHeight`
- `sectionCSS` option is now `blockCSS`
- `toggleSlider()` method is now just `toggle()`
- Animation is now performed with CSS3 transitions, rather than `jQuery.animate()`
- IE 8 and 9 are no longer supported, because those browsers hate kittens
- `init()` is now called within a `window.onload` event handler, which can briefly delay collapsing content
- `setBoxHeight()` is now a "private" method called `setBoxHeights()`
- `resizeBoxes()` is also now private
- Readmore.js now uses attribute selectors, rather than classes
    - The `.readmore-js-section` and `.readmore-js-toggle` classes are gone
    - The `expandedClass` and `collapsedClass` options are also gone
    - Every Readmore.js block needs an ID, if one is not already present, one will be generated 



