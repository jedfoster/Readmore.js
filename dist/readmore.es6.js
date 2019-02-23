let uniqueIdCounter = 0;

const isCssEmbeddedFor = [];

// from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
((function removePolyfill(arr) {
  arr.forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(item, 'remove')) {
      return;
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        if (this.parentNode !== null) {
          this.parentNode.removeChild(this);
        }
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]));

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

function debounce(func, wait, immediate) {
  let timeout;

  return function debouncedFunc(...args) {
    const callNow = immediate && !timeout;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(this, args);
  };
}

function uniqueId() {
  uniqueIdCounter += 1;

  return `rmjs-${uniqueIdCounter}`;
}

function setBoxHeights(element) {
  element.style.height = 'auto';

  const expandedHeight = parseInt(element.getBoundingClientRect().height, 10);
  const cssMaxHeight = parseInt(window.getComputedStyle(element).maxHeight, 10);
  const defaultHeight = parseInt(element.readmore.defaultHeight, 10);

  // Store our measurements.
  element.readmore.expandedHeight = expandedHeight;
  element.readmore.maxHeight = cssMaxHeight;
  element.readmore.collapsedHeight = cssMaxHeight || element.readmore.collapsedHeight || defaultHeight;

  element.style.maxHeight = 'none';
}

function createElementFromString(htmlString) {
  const div = document.createElement('div');
  div.innerHTML = htmlString;

  return div.firstChild;
}

function embedCSS(selector, options) {
  if (!isCssEmbeddedFor[selector]) {
    let styles = '';

    if (options.embedCSS && options.blockCSS !== '') {
      styles += `${selector} + [data-readmore-toggle], ${selector}[data-readmore] {
        ${options.blockCSS}
      }`;
    }

    // Include the transition CSS even if embedCSS is false
    styles += `${selector}[data-readmore] {
      transition: height ${options.speed}ms;
      overflow: hidden;
    }`;

    (((d, u) => {
      const css = d.createElement('style');
      css.type = 'text/css';

      if (css.styleSheet) {
        css.styleSheet.cssText = u;
      } else {
        css.appendChild(d.createTextNode(u));
      }

      d.getElementsByTagName('head')[0].appendChild(css);
    })(document, styles));

    isCssEmbeddedFor[selector] = true;
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
  toggleLink.addEventListener('click', clickHandler.bind(scope));

  return toggleLink;
}

function isEnvironmentSupported() {
  return (typeof window !== 'undefined' && typeof document !== 'undefined')
    && !!document.querySelectorAll && !!window.addEventListener;
}

const resizeBoxes = debounce(() => {
  const elements = document.querySelectorAll('[data-readmore]');

  forEach(elements, (element) => {
    const expanded = element.getAttribute('aria-expanded') === 'true';

    setBoxHeights(element);

    element.style.height = `${expanded ? element.readmore.expandedHeight : element.readmore.collapsedHeight}px`;
  });
}, 100);

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
  afterToggle: () => {}
};

class Readmore {
  constructor(...args) {
    if (!isEnvironmentSupported()) return;

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
    if (!elements.length) return;

    this.options = extend({}, defaults, options);

    if (typeof selector === 'string') {
      embedCSS(selector, this.options);
    } else {
      // Instances need distinct selectors so they don't stomp on each other.
      this.instanceSelector = `.${uniqueId()}`;
      embedCSS(this.instanceSelector, this.options);
    }

    // Need to resize boxes when the page has fully loaded.
    window.addEventListener('load', resizeBoxes);
    window.addEventListener('resize', resizeBoxes);

    this.elements = [];

    forEach(elements, (element) => {
      if (this.instanceSelector) {
        element.classList.add(this.instanceSelector.substr(1));
      }

      const expanded = this.options.startOpen;

      element.readmore = {
        defaultHeight: this.options.collapsedHeight,
        heightMargin: this.options.heightMargin
      };

      setBoxHeights(element);

      const { heightMargin } = element.readmore;

      if (element.getBoundingClientRect().height <= element.readmore.collapsedHeight + heightMargin) {
        if (typeof this.options.blockProcessed === 'function') {
          this.options.blockProcessed(element, false);
        }
        return;
      }

      element.setAttribute('data-readmore', '');
      element.setAttribute('aria-expanded', expanded);
      element.id = element.id || uniqueId();

      const toggleLink = expanded ? this.options.lessLink : this.options.moreLink;
      const toggleElement = buildToggle(toggleLink, element, this);

      element.parentNode.insertBefore(toggleElement, (this.options.sourceOrder === 'before') ? element : element.nextSibling);

      element.style.height = `${expanded ? element.readmore.expandedHeight : element.readmore.collapsedHeight}px`;

      if (typeof this.options.blockProcessed === 'function') {
        this.options.blockProcessed(element, true);
      }

      this.elements.push(element);
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
      const expanded = element.getBoundingClientRect().height <= element.readmore.collapsedHeight;
      const newHeight = expanded ? element.readmore.expandedHeight : element.readmore.collapsedHeight;

      // Fire beforeToggle callback
      // Since we determined the new "expanded" state above we're now out of sync
      // with our true current state, so we need to flip the value of `expanded`
      if (typeof this.options.beforeToggle === 'function') {
        const shouldContinueToggle = this.options.beforeToggle(trigger, element, !expanded);

        // if the beforeToggle callback returns false, stop toggling
        if (shouldContinueToggle === false) {
          return;
        }
      }

      element.style.height = `${newHeight}px`;

      const transitionendHandler = (transitionEvent) => {
        // Fire afterToggle callback
        if (typeof this.options.afterToggle === 'function') {
          this.options.afterToggle(trigger, element, expanded);
        }

        transitionEvent.stopPropagation();

        element.setAttribute('aria-expanded', expanded);
        element.removeEventListener('transitionend', transitionendHandler, false);
      };

      element.addEventListener('transitionend', transitionendHandler, false);

      if (this.options.speed < 1) {
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

    if (typeof el === 'object' && !el.nodeName) { // element is likely a NodeList
      forEach(el, toggleElement);
    } else {
      toggleElement(el);
    }
  }

  destroy(selector) {
    let elements;

    if (!selector) {
      elements = this.elements; // eslint-disable-line
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

      delete element.readmore;

      element.style.height = 'initial';
      element.style.maxHeight = 'initial';

      element.removeAttribute('data-readmore');
      element.removeAttribute('aria-expanded');

      const trigger = document.querySelector(`[aria-controls="${element.id}"]`);
      if (trigger) {
        trigger.remove();
      }

      if (element.id.indexOf('rmjs-') !== -1) {
        element.removeAttribute('id');
      }
    });

    delete this;
  }
}

Readmore.VERSION = __VERSION__;

export default Readmore;
