let uniqueIdCounter = 0;

const isCssEmbeddedFor = [];

function extend(...objects) {
  const hasProp = {}.hasOwnProperty;
  let child = objects[0];
  let parent = objects[1];

  if (objects.length > 2) {
    const args = [];

    objects.forEach((value) => {
      args.push(value);
    });

    while (args.length > 2) {
      const c1 = args.shift();
      const p1 = args.shift();
      args.unshift(extend(c1, p1));
    }

    child = args.shift();
    parent = args.shift();
  }

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

function uniqueId(prefix = 'rmjs-') {
  uniqueIdCounter += 1;

  return `${prefix}${uniqueIdCounter}`;
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

function embedCSS(options) {
  if (!isCssEmbeddedFor[options.selector]) {
    let styles = ' ';

    if (options.embedCSS && options.blockCSS !== '') {
      styles += `${options.selector} + [data-readmore-toggle], ${options.selector}[data-readmore] {
        ${options.blockCSS}
      }`;
    }

    // Include the transition CSS even if embedCSS is false
    styles += `${options.selector}[data-readmore] {
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

    isCssEmbeddedFor[options.selector] = true;
  }
}

function buildToggle(link, element, scope) {
  function clickHandler(event) {
    this.toggle(event.target, element, event);
  }

  const toggleLink = createElementFromString(link);
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
  document.querySelectorAll('[data-readmore]').forEach((element) => {
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

  // callbacks
  blockProcessed: () => {},
  beforeToggle: () => {},
  afterToggle: () => {}
};

class Readmore {
  constructor(selector, options) {
    if (!isEnvironmentSupported()) return;

    this.options = extend({}, defaults, options);
    this.options.selector = selector;

    embedCSS(this.options);

    // Need to resize boxes when the page has fully loaded.
    window.addEventListener('load', resizeBoxes);
    window.addEventListener('resize', resizeBoxes);

    document.querySelectorAll(selector).forEach((element) => {
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

      const id = element.id || uniqueId();

      element.setAttribute('data-readmore', '');
      element.setAttribute('aria-expanded', expanded);
      element.id = id;

      const toggleLink = expanded ? this.options.lessLink : this.options.moreLink;

      element.parentNode.insertBefore(buildToggle(toggleLink, element, this), element.nextSibling);

      element.style.height = `${expanded ? element.readmore.expandedHeight : element.readmore.collapsedHeight}px`;

      if (typeof this.options.blockProcessed === 'function') {
        this.options.blockProcessed(element, true);
      }
    }, this);
  }

  // Signature when called internally by the toggleLink click handler:
  //   toggle(trigger, element, event)
  //
  // When called externally by an instance,
  // e.g. readmoreDemo.toggle(document.querySelector('article:nth-of-type(1)')):
  //   toggle(elementOrQuerySelector)
  toggle(...args) {
    let element = args[1] || args.shift();

    if (typeof element === 'string') {
      element = document.querySelector(element);
    }

    if (element === null) {
      throw new Error('Element MUST be either an HTML node or querySelector string');
    }

    const trigger = args[0] || document.querySelector(`[aria-controls="${element.id}"]`);
    const event = args[2];

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const expanded = element.getBoundingClientRect().height <= element.readmore.collapsedHeight;
    const newHeight = expanded ? element.readmore.expandedHeight : element.readmore.collapsedHeight;

    // Fire beforeToggle callback
    // Since we determined the new "expanded" state above we're now out of sync
    // with our true current state, so we need to flip the value of `expanded`
    if (typeof this.options.beforeToggle === 'function') {
      this.options.beforeToggle(trigger, element, !expanded);
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

    trigger.parentNode.replaceChild(buildToggle(toggleLink, element, this), trigger);
  }

  destroy() {
    // TBD
    console.warn(this);
  }
}

Readmore.VERSION = __VERSION__;

export default Readmore;
