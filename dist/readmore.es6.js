/*!
 * @preserve
 *
 * Readmore.js plugin
 * Author: Jed Foster
 * Project home: jedfoster.com/Readmore.js
 * Version: 3.0.0-beta-1
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

function targetHeight({ expanded, expandedHeight, collapsedHeight }) {
  return expanded ? expandedHeight : collapsedHeight;
}

function resolveCollapsedHeight({ option, element, cssMaxHeight }) {
  if (typeof option === 'function') {
    return option(element);
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
  return entry.contentBoxSize ? entry.contentBoxSize[0].inlineSize : entry.contentRect.width;
}

const embeddedStyles = new Map();
let liveBlocks = 0;

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
  element.style.height = 'auto';
  element.style.maxHeight = 'none';

  const expandedHeight = parseInt(element.getBoundingClientRect().height, 10);

  // Clearing the inline value lets the stylesheet's max-height (and its media queries) show through again.
  element.style.maxHeight = '';

  const cssMaxHeight = parseInt(window.getComputedStyle(element).maxHeight, 10);

  element.style.maxHeight = 'none';

  // Store our measurements.
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

function remeasure(element) {
  if (!element.readmore) {
    return;
  }

  setBoxHeights(element);

  element.style.height = `${targetHeight(element.readmore)}px`;
}

const resizeBoxes = debounce(() => {
  forEach(document.querySelectorAll('[data-readmore]'), remeasure);
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

          const seeded = readmore.width !== undefined;
          const changed = readmore.width !== width;

          readmore.width = width;

          if (seeded && changed) {
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

      const expanded = this.options.startOpen;

      element.readmore = {
        expanded,
        collapsedHeightOption: this.options.collapsedHeight,
        heightMargin: this.options.heightMargin,
      };

      setBoxHeights(element);

      const { heightMargin } = element.readmore;

      if (!shouldFold(element.getBoundingClientRect().height, element.readmore.collapsedHeight, heightMargin)) {
        if (typeof this.options.blockProcessed === 'function') {
          this.options.blockProcessed(element, false);
        }

        return;
      }

      element.setAttribute('data-readmore', '');
      element.style.overflow = 'hidden';
      applyTransition(element, this.options.speed);
      element.id = element.id || uniqueId();

      const toggleLink = expanded ? this.options.lessLink : this.options.moreLink;
      const toggleElement = buildToggle(toggleLink, element, this);

      element.parentNode.insertBefore(toggleElement, this.options.sourceOrder === 'before' ? element : element.nextSibling);

      element.style.height = `${targetHeight(element.readmore)}px`;

      if (resizeObserver) {
        resizeObserver.observe(element);
      }

      if (typeof this.options.blockProcessed === 'function') {
        this.options.blockProcessed(element, true);
      }

      this.elements.push(element);
      liveBlocks += 1;
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
      const trigger = document.querySelector(`[aria-controls="${element.id}"]`);
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
        trigger.remove();
      } else if (trigger && trigger.parentNode) {
        trigger.parentNode.replaceChild(buildToggle(toggleLink, element, this), trigger);
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

      liveBlocks -= 1;

      if (element.readmore.transitionendHandler) {
        element.removeEventListener('transitionend', element.readmore.transitionendHandler, false);
      }

      if (resizeObserver) {
        resizeObserver.unobserve(element);
      }

      delete element.readmore;

      element.style.height = '';
      element.style.maxHeight = 'initial';
      element.style.overflow = '';
      element.style.transition = '';

      element.removeAttribute('data-readmore');

      const trigger = document.querySelector(`[aria-controls="${element.id}"]`);

      if (trigger) {
        trigger.remove();
      }

      if (element.id.indexOf('rmjs-') !== -1) {
        element.removeAttribute('id');
      }
    });

    if (this.elements.length === 0 && this.styleSelector) {
      releaseCSS(this.styleSelector);
      this.styleSelector = null;
    }

    if (liveBlocks === 0) {
      window.removeEventListener('load', resizeBoxes);
      window.removeEventListener('resize', resizeBoxes);
    }
  }
}

Readmore.VERSION = "3.0.0-beta-1";

export { Readmore as default };
