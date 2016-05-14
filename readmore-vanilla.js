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

  var Readmore, cssEmbedded, hasProp, supportedEnv, uniqueIdCounter;

  hasProp = {}.hasOwnProperty;

  function forEach(array, callback, scope) {
    for (var i = 0; i < array.length; i++) {
      callback.call(scope, i, array[i]);
    }
  };

  function extend(child, parent) {
    var args, c1, key, p1;
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

  supportedEnv = !!document.querySelectorAll && !!root.addEventListener;
  uniqueIdCounter = 0;
  cssEmbedded = {};

  function uniqueId(prefix) {
    var id;

    id = ++uniqueIdCounter;

    return String(prefix == null ? 'rmjs-' : prefix) + id;
  }

  function setBoxHeights(element) {
    var collapsedHeight, cssMaxHeight, defaultHeight, el, elCSS, elRect, elementCSS, elementRect, expandedHeight, width;

    elementRect = element.getBoundingClientRect();
    elementCSS = getComputedStyle(element);

    el = element.cloneNode(true);
    el.style.height = 'auto';
    el.style.height = elementRect.width;
    el.style.overflow = 'hidden';

    element.parentNode.insertBefore(el, element);

    elCSS = getComputedStyle(el);

    el.style.maxHeight = 'none';

    elRect = el.getBoundingClientRect();

    expandedHeight = parseInt(elRect.height, 10);
    cssMaxHeight = parseInt(elCSS.maxHeight, 10);
    defaultHeight = parseInt(element.readmore.defaultHeight, 10);

    element.parentNode.removeChild(el);

    collapsedHeight = cssMaxHeight || element.readmore.collapsedHeight || defaultHeight;

    // Store our measurements.
    element.readmore.expandedHeight = expandedHeight;
    element.readmore.maxHeight = cssMaxHeight;
    element.readmore.collapsedHeight = collapsedHeight;

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

    if (!cssEmbedded[options.selector]) {
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

      cssEmbedded[options.selector] = true;
    }
  }


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
      if (!supportedEnv) return;

      this.elements = [];
      this.options = extend({}, defaults, options);
      this.options.selector = selector;

      embedCSS(this.options);

      forEach(document.querySelectorAll(selector), function(i, element) {
        var collapsedHeight, heightMargin, id, toggleLink;

        element.readmore = {
          defaultHeight: this.options.collapsedHeight,
          heightMargin: this.options.heightMargin
        };

        setBoxHeights(element);

        collapsedHeight = element.readmore.collapsedHeight;
        heightMargin = element.readmore.heightMargin;

        if (element.getBoundingClientRect().height <= collapsedHeight + heightMargin) {
          if (this.options.blockProcessed && typeof this.options.blockProcessed === 'function') {
            this.options.blockProcessed(element, false);
          }
          return;
        }
        else {
          id = element.id || uniqueId();
          toggleLink = createElementFromString(this.options.startOpen ? this.options.lessLink : this.options.moreLink);

          element.setAttribute('data-readmore', '');
          element.setAttribute('aria-expanded', this.options.startOpen);
          element.id = id;

          toggleLink.setAttribute('data-readmore-toggle', id);
          toggleLink.setAttribute('aria-controls', id);
          toggleLink.addEventListener('click', (function(_this) {
            return function(event) {
              _this.toggle(this, element, event);
            }
          })(this));

          element.parentNode.insertBefore(toggleLink, element.nextSibling);

          if (!this.options.startOpen) {
            element.style.height = collapsedHeight + 'px';
          }

          if (this.options.blockProcessed && typeof this.options.blockProcessed === 'function') {
            this.options.blockProcessed(element, true);
          }
        }

        this.elements.push(element);
      }, this);
    }

    Readmore.prototype.toggle = function(trigger, element, event) {
      var collapsedHeight, expanded, newHeight, newToggle, transitionendHandler;

      if (event) event.preventDefault();

      // this.element only exists for jQuery-ified elements, may not make sense now
      // trigger = trigger || document.querySelector('[aria-controls="' + this.element.id + '"]');
      // element = element || this.element;

      collapsedHeight = element.readmore.collapsedHeight

      if (element.getBoundingClientRect().height <= collapsedHeight) {
        newHeight = element.readmore.expandedHeight;
        newToggle = createElementFromString(this.options.lessLink);
        expanded = true;
      }
      else {
        newHeight = collapsedHeight;
        newToggle = createElementFromString(this.options.moreLink);
      }

      // Fire beforeToggle callback
      // Since we determined the new "expanded" state above we're now out of sync
      // with our true current state, so we need to flip the value of `expanded`
      if (this.options.beforeToggle && typeof this.options.beforeToggle === 'function') {
        this.options.beforeToggle(trigger, element, !expanded);
      }

      element.style.height = newHeight + 'px';

      transitionendHandler = (function(_this) {
        return function() {
          if (_this.options.afterToggle && typeof _this.options.afterToggle === 'function') {
            _this.options.afterToggle(trigger, element, expanded);
          }

          this.setAttribute('aria-expanded', expanded);

          this.removeEventListener('transitionend', transitionendHandler);
        }
      })(this);

      element.addEventListener('transitionend', transitionendHandler);

      newToggle.setAttribute('data-readmore-toggle', element.id);
      newToggle.setAttribute('aria-controls', element.id);
      newToggle.addEventListener('click', (function(_this) {
        return function(event) {
          _this.toggle(this, element, event);
        }
      })(this));

      trigger.parentNode.replaceChild(newToggle, trigger);
    };

    Readmore.prototype.destroy = function() {}

    return Readmore;

  })();

  root.Readmore = Readmore;
})(this);

