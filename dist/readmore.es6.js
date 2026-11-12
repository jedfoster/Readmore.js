/*!
 * @preserve
 *
 * Readmore.js plugin
 * Author: Jed Foster
 * Project home: jedfoster.com/Readmore.js
 * Version: 3.1.0
 * Source: github.com/jedfoster/Readmore.js
 * Licensed under the MIT license
 *
 * Debounce function from davidwalsh.name/javascript-debounce-function
 */

let uniqueIdCounter = 0;

function debounce(func, wait, immediate) {
  let timeout;

  return function debouncedFunc(...args) {
    const later = () => {
      timeout = null;
      {
        func.apply(this, args);
      }
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function uniqueId() {
  uniqueIdCounter += 1;

  return `rmjs-${uniqueIdCounter}`;
}

function shouldFold(height, collapsedHeight, heightMargin) {
  return height > collapsedHeight + heightMargin;
}

// That loop flips a block every frame or two; a person resizing the window back to the same width takes far longer.
const loopWindow = 500;

// Folding a block can take the page's scrollbar away, which widens the block and can unfold it, which brings the scrollbar back.
// A block about to fold, right after unfolding, at the width it folded at the flip before is in that loop, so it stays unfolded.
function isFoldLoop(flips, width, time) {
  return flips.length === 2 && flips[0].folded && flips[0].width === width && time - flips[1].time < loopWindow;
}

function recordFlip(flips, width, folded, time) {
  return [...flips, { width, folded, time }].slice(-2);
}

function targetHeight({ expanded, expandedHeight, collapsedHeight }) {
  return expanded ? expandedHeight : collapsedHeight;
}

function resolveCollapsedHeight({ option, element, cssMaxHeight }) {
  if (typeof option === 'function') {
    const fromFunction = Number(option(element));

    // Infinity is how a function says not to fold the block at all.
    if (Number.isFinite(fromFunction) || fromFunction === Infinity) {
      return fromFunction;
    }
  }

  if (Number.isFinite(cssMaxHeight)) {
    return cssMaxHeight;
  }

  return parseInt(option, 10);
}

function transitionFor(speed, reducedMotion) {
  return speed > 0 && !reducedMotion ? `height ${speed}ms` : '';
}

function widthOf(entry) {
  return entry.borderBoxSize ? entry.borderBoxSize[0].inlineSize : entry.target.getBoundingClientRect().width;
}

const embeddedStyles = new Map();
const liveBlocks = new Set();

function forEach(arr, callback, scope) {
  for (let i = 0; i < arr.length; i += 1) {
    callback.call(scope, arr[i], i);
  }
}

function extend(...objects) {
  const hasProp = {}.hasOwnProperty;
  let child = objects[0];
  let parent = objects[1];

  if (objects.length > 2) {
    const args = [];

    Object.keys(objects).forEach((key) => {
      args.push(objects[key]);
    });

    while (args.length > 2) {
      const c1 = args.shift();
      const p1 = args.shift();

      args.unshift(extend(c1, p1));
    }

    child = args.shift();
    parent = args.shift();
  }

  if (parent) {
    Object.keys(parent).forEach((key) => {
      if (hasProp.call(parent, key)) {
        if (typeof parent[key] === 'object') {
          child[key] = child[key] || {};
          child[key] = extend(child[key], parent[key]);
        } else {
          child[key] = parent[key];
        }
      }
    });
  }

  return child;
}

function setBoxHeights(element) {
  // The observer's first report on a block can come after its width has already changed (WebKit), so it's compared against this.
  element.readmore.width = element.getBoundingClientRect().width;

  const { overflow } = element.style;

  element.style.height = 'auto';
  element.style.maxHeight = 'none';
  // Whether to fold is decided on the block as it looks unfolded, with its children's margins collapsing through it.
  element.style.overflow = '';

  const naturalHeight = element.getBoundingClientRect().height;

  // A folded block's overflow: hidden keeps its children's margins inside it, so it's measured that way.
  element.style.overflow = 'hidden';

  const expandedHeight = Math.ceil(element.getBoundingClientRect().height);

  element.style.overflow = overflow;

  // Restoring the author's own inline value (if any) lets it and the stylesheet's max-height (and its media queries) show through again.
  element.style.maxHeight = element.readmore.inlineMaxHeight;

  const cssMaxHeight = parseInt(window.getComputedStyle(element).maxHeight, 10);

  element.style.maxHeight = 'none';

  // Store our measurements.
  element.readmore.naturalHeight = naturalHeight;
  element.readmore.expandedHeight = expandedHeight;
  element.readmore.maxHeight = cssMaxHeight;
  element.readmore.collapsedHeight = resolveCollapsedHeight({
    option: element.readmore.collapsedHeightOption,
    element,
    cssMaxHeight,
  });
}

function createElementFromString(htmlString) {
  const div = document.createElement('div');

  div.innerHTML = htmlString;

  return div.firstElementChild;
}

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function applyTransition(element, speed) {
  element.style.transition = transitionFor(speed, prefersReducedMotion());
}

// Instances sharing a selector string share one tag, so it goes when the last of them is emptied.
function embedCSS(selector, options) {
  if (!options.embedCSS || options.blockCSS === '') {
    return false;
  }

  if (embeddedStyles.has(selector)) {
    embeddedStyles.get(selector).users += 1;

    return true;
  }

  const css = document.createElement('style');

  css.appendChild(
    document.createTextNode(`${selector} + [data-readmore-toggle], ${selector}[data-readmore] {
        ${options.blockCSS}
      }`),
  );
  document.head.appendChild(css);

  embeddedStyles.set(selector, { css, users: 1 });

  return true;
}

function releaseCSS(selector) {
  const entry = embeddedStyles.get(selector);

  if (!entry) {
    return;
  }

  entry.users -= 1;

  if (entry.users === 0) {
    entry.css.remove();
    embeddedStyles.delete(selector);
  }
}

function buildToggle(link, element, scope) {
  function clickHandler(event) {
    this.toggle(element, event);
  }

  let text = link;

  if (typeof link === 'function') {
    text = link(element);
  }

  const toggleLink = createElementFromString(text);

  toggleLink.setAttribute('data-readmore-toggle', element.id);
  toggleLink.setAttribute('aria-controls', element.id);
  toggleLink.setAttribute('aria-expanded', element.readmore.expanded);
  toggleLink.addEventListener('click', clickHandler.bind(scope));

  return toggleLink;
}

function isEnvironmentSupported() {
  return (
    typeof window !== 'undefined' && typeof document !== 'undefined' && !!document.querySelectorAll && !!window.addEventListener
  );
}

function fold(element) {
  const { readmore } = element;
  const { options } = readmore.instance;

  element.setAttribute('data-readmore', '');
  element.style.overflow = 'hidden';
  applyTransition(element, options.speed);
  element.id = element.id || uniqueId();

  const toggleLink = readmore.expanded ? options.lessLink : options.moreLink;

  // With no lessLink, an expanded block's toggle went away when it opened, so it doesn't come back.
  if (toggleLink) {
    readmore.toggle = buildToggle(toggleLink, element, readmore.instance);
    element.parentNode.insertBefore(readmore.toggle, options.sourceOrder === 'before' ? element : element.nextSibling);
  }

  readmore.folded = true;
}

function unfold(element) {
  const { readmore } = element;

  element.removeAttribute('data-readmore');
  element.style.overflow = '';
  element.style.transition = '';
  readmore.toggle?.remove();
  readmore.toggle = null;
  readmore.folded = false;
}

function remeasure(element) {
  if (!element.readmore) {
    return;
  }

  // A hidden block (in an inactive tab, say) measures 0. Its width changes when it's shown, which re-measures it.
  if (element.getClientRects().length === 0) {
    element.readmore.width = 0;

    return;
  }

  setBoxHeights(element);

  const { readmore } = element;

  const folds =
    shouldFold(readmore.naturalHeight, readmore.collapsedHeight, readmore.heightMargin) &&
    (readmore.folded || !isFoldLoop(readmore.flips, readmore.width, performance.now()));

  if (folds !== readmore.folded) {
    if (folds) {
      fold(element);
    } else {
      unfold(element);
    }

    readmore.flips = recordFlip(readmore.flips, readmore.width, folds, performance.now());
  }

  if (folds) {
    element.style.height = `${targetHeight(readmore)}px`;
  }

  // Setting a height mid-transition cancels it, so no transitionend will arrive for the pending toggle.
  readmore.transitionendHandler?.({ target: element });
}

const resizeBoxes = debounce(() => {
  liveBlocks.forEach(remeasure);
}, 100);

const pendingRemeasure = new Set();
let remeasureFrame = null;

function flushRemeasure() {
  const elements = Array.from(pendingRemeasure);

  pendingRemeasure.clear();
  remeasureFrame = null;
  elements.forEach(remeasure);
}

// Re-measuring inside the callback would resize observed blocks mid-delivery, which raises a loop error.
const resizeObserver =
  typeof ResizeObserver === 'undefined'
    ? null
    : new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const { readmore } = entry.target;
          const width = widthOf(entry);

          if (!readmore) {
            return;
          }

          if (readmore.width !== width) {
            readmore.width = width;
            pendingRemeasure.add(entry.target);
          }
        });

        if (pendingRemeasure.size > 0 && remeasureFrame === null) {
          remeasureFrame = requestAnimationFrame(flushRemeasure);
        }
      });

const defaults = {
  speed: 100,
  collapsedHeight: 200,
  heightMargin: 16,
  moreLink: '<a href="#">Read More</a>',
  lessLink: '<a href="#">Close</a>',
  embedCSS: true,
  blockCSS: 'display: block; width: 100%;',
  startOpen: false,
  sourceOrder: 'after',

  // callbacks
  blockProcessed: () => {},
  beforeToggle: () => {},
  afterToggle: () => {},
};

class Readmore {
  constructor(...args) {
    if (!isEnvironmentSupported()) {
      return;
    }

    const [selector, options] = args;
    let elements;

    if (typeof selector === 'string') {
      elements = document.querySelectorAll(selector);
    } else if (selector.nodeName) {
      elements = [selector]; // emulate a NodeList by casting a single Node as an array
    } else {
      elements = selector;
    }

    // After all that, if we _still_ don't have iteratable NodeList, bail out.
    if (!elements.length) {
      return;
    }

    this.options = extend({}, defaults, options);

    let styleSelector = selector;

    if (typeof selector !== 'string') {
      // Instances need distinct selectors so they don't stomp on each other.
      this.instanceSelector = `.${uniqueId()}`;
      styleSelector = this.instanceSelector;
    }

    if (embedCSS(styleSelector, this.options)) {
      this.styleSelector = styleSelector;
    }

    // Need to resize boxes when the page has fully loaded.
    window.addEventListener('load', resizeBoxes);

    if (!resizeObserver) {
      window.addEventListener('resize', resizeBoxes);
    }

    this.elements = [];

    forEach(elements, (element) => {
      if (this.instanceSelector) {
        element.classList.add(this.instanceSelector.substr(1));
      }

      element.readmore = {
        instance: this,
        expanded: this.options.startOpen,
        folded: false,
        flips: [],
        inlineMaxHeight: element.style.maxHeight,
        collapsedHeightOption: this.options.collapsedHeight,
        heightMargin: this.options.heightMargin,
      };

      remeasure(element);

      // Every block is watched, folded or not, so one that outgrows the fold (or stops needing it) is caught.
      if (resizeObserver) {
        resizeObserver.observe(element);
      }

      if (typeof this.options.blockProcessed === 'function') {
        this.options.blockProcessed(element, element.readmore.folded);
      }

      this.elements.push(element);
      liveBlocks.add(element);
    });
  }

  // Signature when called internally by the toggleLink click handler:
  //   toggle(element, event)
  //
  // When called externally by an instance,
  // e.g. readmoreDemo.toggle(document.querySelector('article:nth-of-type(1)')):
  //   toggle(elementOrQuerySelector)
  toggle(...args) {
    let el = args[0];

    const toggleElement = (element) => {
      if (!element.readmore?.folded) {
        return;
      }

      // Held on the block, not looked up in the document, which can't see into a shadow root.
      const trigger = element.readmore.toggle;
      const expanded = !element.readmore.expanded;

      // beforeToggle receives the current (pre-toggle) state
      if (typeof this.options.beforeToggle === 'function') {
        const shouldContinueToggle = this.options.beforeToggle(trigger, element, !expanded);

        // if the beforeToggle callback returns false, stop toggling
        if (shouldContinueToggle === false) {
          return;
        }
      }

      element.readmore.expanded = expanded;
      applyTransition(element, this.options.speed);
      element.style.height = `${targetHeight(element.readmore)}px`;

      if (element.readmore.transitionendHandler) {
        element.removeEventListener('transitionend', element.readmore.transitionendHandler, false);
      }

      const transitionendHandler = (transitionEvent) => {
        element.readmore.transitionendHandler = null;

        // Fire afterToggle callback
        if (typeof this.options.afterToggle === 'function') {
          this.options.afterToggle(trigger, element, expanded);
        }

        transitionEvent.stopPropagation?.();

        element.removeEventListener('transitionend', transitionendHandler, false);
      };

      element.readmore.transitionendHandler = transitionendHandler;
      element.addEventListener('transitionend', transitionendHandler, false);

      if (this.options.speed < 1 || prefersReducedMotion()) {
        transitionendHandler.call(this, { target: element });
      }

      const toggleLink = expanded ? this.options.lessLink : this.options.moreLink;

      if (!toggleLink) {
        trigger?.remove();
        element.readmore.toggle = null;
      } else if (trigger && trigger.parentNode) {
        element.readmore.toggle = buildToggle(toggleLink, element, this);
        trigger.parentNode.replaceChild(element.readmore.toggle, trigger);
      }
    };

    if (typeof el === 'string') {
      el = document.querySelectorAll(el);
    }

    if (!el) {
      throw new Error('Element MUST be either an HTML node or querySelector string');
    }

    const event = args[1];

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (typeof el === 'object' && !el.nodeName) {
      // element is likely a NodeList
      forEach(el, toggleElement);
    } else {
      toggleElement(el);
    }
  }

  destroy(selector) {
    let elements;

    if (!selector) {
      elements = this.elements;
    } else if (typeof selector === 'string') {
      elements = document.querySelectorAll(selector);
    } else if (selector.nodeName) {
      elements = [selector]; // emulate a NodeList by casting a single Node as an array
    } else {
      elements = selector;
    }

    forEach(elements, (element) => {
      if (this.elements.indexOf(element) === -1) {
        return;
      }

      this.elements = this.elements.filter((el) => el !== element);

      if (this.instanceSelector) {
        element.classList.remove(this.instanceSelector.substr(1));
      }

      liveBlocks.delete(element);

      if (element.readmore.transitionendHandler) {
        element.removeEventListener('transitionend', element.readmore.transitionendHandler, false);
      }

      if (resizeObserver) {
        resizeObserver.unobserve(element);
      }

      element.style.height = '';
      element.style.maxHeight = element.readmore.inlineMaxHeight;
      element.readmore.toggle?.remove();

      delete element.readmore;

      element.style.overflow = '';
      element.style.transition = '';

      element.removeAttribute('data-readmore');

      if (element.id.indexOf('rmjs-') !== -1) {
        element.removeAttribute('id');
      }
    });

    if (this.elements.length === 0 && this.styleSelector) {
      releaseCSS(this.styleSelector);
      this.styleSelector = null;
    }

    if (liveBlocks.size === 0) {
      window.removeEventListener('load', resizeBoxes);
      window.removeEventListener('resize', resizeBoxes);
    }
  }
}

Readmore.VERSION = "3.1.0";

export { Readmore as default };
