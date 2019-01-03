/*!
 *  @preserve
 * 
 * Readmore.js plugin
 * Author: @jed_foster
 * Project home: jedfoster.com/Readmore.js
 * Version: 3.0.0-alpha-2
 * Licensed under the MIT license
 * 
 * Debounce function from davidwalsh.name/javascript-debounce-function
 */
window["Readmore"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uniqueIdCounter = 0;

var isCssEmbeddedFor = [];

// from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
(function (arr) {
  arr.forEach(function (item) {
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
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

function extend() {
  for (var _len = arguments.length, objects = Array(_len), _key = 0; _key < _len; _key++) {
    objects[_key] = arguments[_key];
  }

  var hasProp = {}.hasOwnProperty;
  var child = objects[0];
  var parent = objects[1];

  if (objects.length > 2) {
    var args = [];

    Object.keys(objects).forEach(function (key) {
      args.push(objects[key]);
    });

    while (args.length > 2) {
      var c1 = args.shift();
      var p1 = args.shift();
      args.unshift(extend(c1, p1));
    }

    child = args.shift();
    parent = args.shift();
  }

  if (parent) {
    Object.keys(parent).forEach(function (key) {
      if (hasProp.call(parent, key)) {
        if (_typeof(parent[key]) === 'object') {
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
  var timeout = void 0;

  return function debouncedFunc() {
    var _this = this;

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var callNow = immediate && !timeout;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(_this, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(this, args);
  };
}

function uniqueId() {
  var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'rmjs-';

  uniqueIdCounter += 1;

  return '' + prefix + uniqueIdCounter;
}

function setBoxHeights(element) {
  element.style.height = 'auto';

  var expandedHeight = parseInt(element.getBoundingClientRect().height, 10);
  var cssMaxHeight = parseInt(window.getComputedStyle(element).maxHeight, 10);
  var defaultHeight = parseInt(element.readmore.defaultHeight, 10);

  // Store our measurements.
  element.readmore.expandedHeight = expandedHeight;
  element.readmore.maxHeight = cssMaxHeight;
  element.readmore.collapsedHeight = cssMaxHeight || element.readmore.collapsedHeight || defaultHeight;

  element.style.maxHeight = 'none';
}

function createElementFromString(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString;

  return div.firstChild;
}

function embedCSS(options) {
  if (!isCssEmbeddedFor[options.selector]) {
    var styles = ' ';

    if (options.embedCSS && options.blockCSS !== '') {
      styles += options.selector + ' + [data-readmore-toggle], ' + options.selector + '[data-readmore] {\n        ' + options.blockCSS + '\n      }';
    }

    // Include the transition CSS even if embedCSS is false
    styles += options.selector + '[data-readmore] {\n      transition: height ' + options.speed + 'ms;\n      overflow: hidden;\n    }';

    (function (d, u) {
      var css = d.createElement('style');
      css.type = 'text/css';

      if (css.styleSheet) {
        css.styleSheet.cssText = u;
      } else {
        css.appendChild(d.createTextNode(u));
      }

      d.getElementsByTagName('head')[0].appendChild(css);
    })(document, styles);

    isCssEmbeddedFor[options.selector] = true;
  }
}

function buildToggle(link, element, scope) {
  function clickHandler(event) {
    this.toggle(element, event);
  }

  var toggleLink = createElementFromString(link);
  toggleLink.setAttribute('data-readmore-toggle', element.id);
  toggleLink.setAttribute('aria-controls', element.id);
  toggleLink.addEventListener('click', clickHandler.bind(scope));

  return toggleLink;
}

function isEnvironmentSupported() {
  return typeof window !== 'undefined' && typeof document !== 'undefined' && !!document.querySelectorAll && !!window.addEventListener;
}

var resizeBoxes = debounce(function () {
  var elements = document.querySelectorAll('[data-readmore]');
  for (var i = 0; i < elements.length; i += 1) {
    var element = elements[i];
    var expanded = element.getAttribute('aria-expanded') === 'true';

    setBoxHeights(element);

    element.style.height = (expanded ? element.readmore.expandedHeight : element.readmore.collapsedHeight) + 'px';
  }
}, 100);

var defaults = {
  speed: 100,
  collapsedHeight: 200,
  heightMargin: 16,
  moreLink: '<a href="#">Read More</a>',
  lessLink: '<a href="#">Close</a>',
  embedCSS: true,
  blockCSS: 'display: block; width: 100%;',
  startOpen: false,

  // callbacks
  blockProcessed: function blockProcessed() {},
  beforeToggle: function beforeToggle() {},
  afterToggle: function afterToggle() {}
};

var Readmore = function () {
  function Readmore(selector, options) {
    _classCallCheck(this, Readmore);

    if (!isEnvironmentSupported()) return;
    var elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    this.options = extend({}, defaults, options);
    this.options.selector = selector;

    embedCSS(this.options);

    // Need to resize boxes when the page has fully loaded.
    window.addEventListener('load', resizeBoxes);
    window.addEventListener('resize', resizeBoxes);

    for (var i = 0; i < elements.length; i += 1) {
      var element = elements[i];
      var expanded = this.options.startOpen;

      element.readmore = {
        defaultHeight: this.options.collapsedHeight,
        heightMargin: this.options.heightMargin
      };

      setBoxHeights(element);

      var heightMargin = element.readmore.heightMargin;


      if (element.getBoundingClientRect().height <= element.readmore.collapsedHeight + heightMargin) {
        if (typeof this.options.blockProcessed === 'function') {
          this.options.blockProcessed(element, false);
        }
        return;
      }

      var id = element.id || uniqueId();

      element.setAttribute('data-readmore', '');
      element.setAttribute('aria-expanded', expanded);
      element.id = id;

      var toggleLink = expanded ? this.options.lessLink : this.options.moreLink;

      element.parentNode.insertBefore(buildToggle(toggleLink, element, this), element.nextSibling);

      element.style.height = (expanded ? element.readmore.expandedHeight : element.readmore.collapsedHeight) + 'px';

      if (typeof this.options.blockProcessed === 'function') {
        this.options.blockProcessed(element, true);
      }
    }
  }

  // Signature when called internally by the toggleLink click handler:
  //   toggle(element, event)
  //
  // When called externally by an instance,
  // e.g. readmoreDemo.toggle(document.querySelector('article:nth-of-type(1)')):
  //   toggle(elementOrQuerySelector)


  _createClass(Readmore, [{
    key: 'toggle',
    value: function toggle() {
      var _this2 = this;

      var element = arguments.length <= 0 ? undefined : arguments[0];

      if (typeof element === 'string') {
        element = document.querySelector(element);
      }

      if (element === null) {
        throw new Error('Element MUST be either an HTML node or querySelector string');
      }

      var trigger = document.querySelector('[aria-controls="' + element.id + '"]');
      var event = arguments.length <= 1 ? undefined : arguments[1];

      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      var expanded = element.getBoundingClientRect().height <= element.readmore.collapsedHeight;
      var newHeight = expanded ? element.readmore.expandedHeight : element.readmore.collapsedHeight;

      // Fire beforeToggle callback
      // Since we determined the new "expanded" state above we're now out of sync
      // with our true current state, so we need to flip the value of `expanded`
      if (typeof this.options.beforeToggle === 'function') {
        this.options.beforeToggle(trigger, element, !expanded);
      }

      element.style.height = newHeight + 'px';

      var transitionendHandler = function transitionendHandler(transitionEvent) {
        // Fire afterToggle callback
        if (typeof _this2.options.afterToggle === 'function') {
          _this2.options.afterToggle(trigger, element, expanded);
        }

        transitionEvent.stopPropagation();

        element.setAttribute('aria-expanded', expanded);
        element.removeEventListener('transitionend', transitionendHandler, false);
      };

      element.addEventListener('transitionend', transitionendHandler, false);

      if (this.options.speed < 1) {
        transitionendHandler.call(this, { target: element });
      }

      var toggleLink = expanded ? this.options.lessLink : this.options.moreLink;

      if (!toggleLink) {
        trigger.remove();
      } else {
        trigger.parentNode.replaceChild(buildToggle(toggleLink, element, this), trigger);
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      // TBD
      console.warn(this);
    }
  }]);

  return Readmore;
}();

Readmore.VERSION = '3.0.0-alpha-2';

exports.default = Readmore;

/***/ })
/******/ ])["default"];
//# sourceMappingURL=readmore.js.map