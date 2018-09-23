/*!
 * @preserve
 *
 * Readmore.js plugin
 * Author: @jed_foster
 * Project home: http://jedfoster.github.io/Readmore.js
 * Licensed under the MIT license
 *
 * Debounce function from http://davidwalsh.name/javascript-debounce-function
 */

(function(root) {
  'use strict';

  var Readmore, isCssEmbeddedFor, isEnvironmentSupported, resizeBoxes, uniqueIdCounter;

  function forEach(array, callback, scope) {
    for (var i = 0; i < array.length; i++) {
      callback.call(scope, i, array[i]);
    }
  };

  function extend(child, parent) {
    var args, c1, hasProp, key, p1;

    hasProp = {}.hasOwnProperty;

    if (arguments.length > 2) {
      args = [];

      forEach(arguments, function(i, value) {
        args.push(value);
      });

      while (args.length > 2) {
        c1 = args.shift();
        p1 = args.shift();
        args.unshift(extend(c1, p1));
      }

      child = args.shift();
      parent = args.shift();
    }

    for (key in parent) {
      if (hasProp.call(parent, key)) {
        if (typeof parent[key] === 'object') {
          child[key] = child[key] || {};
          child[key] = extend(child[key], parent[key]);
        } else {
          child[key] = parent[key];
        }
      }
    }
    return child;
  };

  function debounce(func, wait, immediate) {
    var timeout;

    return function() {
      var args, callNow, context, later;

      args = arguments;
      callNow = immediate && !timeout;
      context = this;
      later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callNow) func.apply(context, args);
    };
  }

  function uniqueId(prefix) {
    var id;

    id = ++uniqueIdCounter;

    return String(prefix == null ? 'rmjs-' : prefix) + id;
  }

  function setBoxHeights(element) {
    var clonedElement, cssMaxHeight, defaultHeight, expandedHeight, width;

    clonedElement = element.cloneNode(true);
    clonedElement.style.height = 'auto';
    clonedElement.style.width = element.getBoundingClientRect().width;
    clonedElement.style.overflow = 'hidden';

    element.parentNode.insertBefore(clonedElement, element);

    clonedElement.style.maxHeight = 'none';

    expandedHeight = parseInt(clonedElement.getBoundingClientRect().height, 10);
    cssMaxHeight = parseInt(getComputedStyle(clonedElement).maxHeight, 10);
    defaultHeight = parseInt(element.readmore.defaultHeight, 10);

    element.parentNode.removeChild(clonedElement);

    // Store our measurements.
    element.readmore.expandedHeight = expandedHeight;
    element.readmore.maxHeight = cssMaxHeight;
    element.readmore.collapsedHeight = cssMaxHeight || element.readmore.collapsedHeight || defaultHeight;

    element.style.maxHeight = 'none';
  }

  function createElementFromString(htmlString) {
    var div;

    div = document.createElement('div');
    div.innerHTML = htmlString;

    return div.firstChild;
  }

  function embedCSS(options) {
    var styles;

    if (!isCssEmbeddedFor[options.selector]) {
      styles = ' ';

      if (options.embedCSS && options.blockCSS !== '') {
        styles += options.selector + ' + [data-readmore-toggle], ' +
          options.selector + '[data-readmore]{' +
            options.blockCSS +
          '}';
      }

      // Include the transition CSS even if embedCSS is false
      styles += options.selector + '[data-readmore]{' +
        'transition: height ' + options.speed + 'ms;' +
        'overflow: hidden;' +
      '}';

      (function(d, u) {
        var css = d.createElement('style');
        css.type = 'text/css';

        if (css.styleSheet) {
          css.styleSheet.cssText = u;
        }
        else {
          css.appendChild(d.createTextNode(u));
        }

        d.getElementsByTagName('head')[0].appendChild(css);
      }(document, styles));

      isCssEmbeddedFor[options.selector] = true;
    }
  }

  function buildToggle(link, element, scope) {
    var clickHandler, toggle;

    clickHandler = function(event) {
      this.toggle(event.target, element, event);
    };

    toggle = createElementFromString(link);
    toggle.setAttribute('data-readmore-toggle', element.id);
    toggle.setAttribute('aria-controls', element.id);
    toggle.addEventListener('click', clickHandler.bind(scope));

    return toggle;
  }

  isEnvironmentSupported = !!document.querySelectorAll && !!root.addEventListener;
  uniqueIdCounter = 0;
  isCssEmbeddedFor = [];

  resizeBoxes = debounce(function() {
    forEach(document.querySelectorAll('[data-readmore]'), function(i, element) {
      setBoxHeights(element);

      element.style.height = ((element.getAttribute('aria-expanded') === 'true') ? element.readmore.expandedHeight : element.readmore.collapsedHeight) + 'px';
    });
  }, 100);

  Readmore = (function() {
    var defaults;

    defaults = {
      speed: 100,
      collapsedHeight: 200,
      heightMargin: 16,
      moreLink: '<a href="#">Read More</a>',
      lessLink: '<a href="#">Close</a>',
      embedCSS: true,
      blockCSS: 'display: block; width: 100%;',
      startOpen: false,

      // callbacks
      blockProcessed: function() {},
      beforeToggle: function() {},
      afterToggle: function() {}
    };

    function Readmore(selector, options) {
      if (!isEnvironmentSupported) return;

      this.options = extend({}, defaults, options);
      this.options.selector = selector;

      embedCSS(this.options);

      // Need to resize boxes when the page has fully loaded.
      window.addEventListener('load', resizeBoxes);
      window.addEventListener('resize', resizeBoxes)

      forEach(document.querySelectorAll(selector), function(i, element) {
        var expanded, heightMargin, id, toggleLink;

        expanded = this.options.startOpen;

        element.readmore = {
          defaultHeight: this.options.collapsedHeight,
          heightMargin: this.options.heightMargin
        };

        setBoxHeights(element);

        heightMargin = element.readmore.heightMargin;

        if (element.getBoundingClientRect().height <= element.readmore.collapsedHeight + heightMargin) {
          if (this.options.blockProcessed && typeof this.options.blockProcessed === 'function') {
            this.options.blockProcessed(element, false);
          }
          return;
        }
        else {
          id = element.id || uniqueId();

          element.setAttribute('data-readmore', '');
          element.setAttribute('aria-expanded', expanded);
          element.id = id;

          toggleLink = expanded ? this.options.lessLink : this.options.moreLink;

          element.parentNode.insertBefore(buildToggle(toggleLink, element, this), element.nextSibling);

          element.style.height = (expanded ? element.readmore.expandedHeight : element.readmore.collapsedHeight) + 'px';

          if (this.options.blockProcessed && typeof this.options.blockProcessed === 'function') {
            this.options.blockProcessed(element, true);
          }
        }
      }, this);
    }

    Readmore.prototype.toggle = function(trigger, element, event) {
      var expanded, newHeight, toggleLink, transitionendHandler;

      if (event) event.preventDefault();

      // this.element only exists for jQuery-ified elements, may not make sense now
      // trigger = trigger || document.querySelector('[aria-controls="' + this.element.id + '"]');
      // element = element || this.element;

      expanded = element.getBoundingClientRect().height <= element.readmore.collapsedHeight;
      newHeight = expanded ? element.readmore.expandedHeight : element.readmore.collapsedHeight;

      // Fire beforeToggle callback
      // Since we determined the new "expanded" state above we're now out of sync
      // with our true current state, so we need to flip the value of `expanded`
      if (this.options.beforeToggle && typeof this.options.beforeToggle === 'function') {
        this.options.beforeToggle(trigger, element, !expanded);
      }

      element.style.height = newHeight + 'px';

      transitionendHandler = function(event) {
        if (this.options.afterToggle && typeof this.options.afterToggle === 'function') {
          this.options.afterToggle(trigger, element, expanded);
        }

        event.target.setAttribute('aria-expanded', expanded);
        event.target.removeEventListener('transitionend', transitionendHandler);
      };

      element.addEventListener('transitionend', transitionendHandler.bind(this));

      toggleLink = expanded ? this.options.lessLink : this.options.moreLink;

      trigger.parentNode.replaceChild(buildToggle(toggleLink, element, this), trigger);
    };

    Readmore.prototype.destroy = function() {}

    return Readmore;

  })();

  root.Readmore = Readmore;
})(global);

