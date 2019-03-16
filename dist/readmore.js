/*!
 *  @preserve
 * 
 * Readmore.js plugin
 * Author: @jed_foster
 * Project home: jedfoster.com/Readmore.js
 * Version: 3.0.0-beta-1
 * Licensed under the MIT license
 * 
 * Debounce function from davidwalsh.name/javascript-debounce-function
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Readmore", [], factory);
	else if(typeof exports === 'object')
		exports["Readmore"] = factory();
	else
		root["Readmore"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@babel/runtime/helpers/classCallCheck.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/createClass.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/createClass.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/typeof.js":
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ }),

/***/ "./src/readmore.js":
/*!*************************!*\
  !*** ./src/readmore.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__);



var uniqueIdCounter = 0;
var isCssEmbeddedFor = []; // from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md

(function removePolyfill(arr) {
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

function forEach(arr, callback, scope) {
  for (var i = 0; i < arr.length; i += 1) {
    callback.call(scope, arr[i], i);
  }
}

function extend() {
  for (var _len = arguments.length, objects = new Array(_len), _key = 0; _key < _len; _key++) {
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
        if (_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2___default()(parent[key]) === 'object') {
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
  var timeout;
  return function debouncedFunc() {
    var _this = this;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
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
  uniqueIdCounter += 1;
  return "rmjs-".concat(uniqueIdCounter);
}

function setBoxHeights(element) {
  element.style.height = 'auto';
  var expandedHeight = parseInt(element.getBoundingClientRect().height, 10);
  var cssMaxHeight = parseInt(window.getComputedStyle(element).maxHeight, 10);
  var defaultHeight = parseInt(element.readmore.defaultHeight, 10); // Store our measurements.

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

function embedCSS(selector, options) {
  if (!isCssEmbeddedFor[selector]) {
    var styles = '';

    if (options.embedCSS && options.blockCSS !== '') {
      styles += "".concat(selector, " + [data-readmore-toggle], ").concat(selector, "[data-readmore] {\n        ").concat(options.blockCSS, "\n      }");
    } // Include the transition CSS even if embedCSS is false


    styles += "".concat(selector, "[data-readmore] {\n      transition: height ").concat(options.speed, "ms;\n      overflow: hidden;\n    }");

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

    isCssEmbeddedFor[selector] = true;
  }
}

function buildToggle(link, element, scope) {
  function clickHandler(event) {
    this.toggle(element, event);
  }

  var text = link;

  if (typeof link === 'function') {
    text = link(element);
  }

  var toggleLink = createElementFromString(text);
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
  forEach(elements, function (element) {
    var expanded = element.getAttribute('aria-expanded') === 'true';
    setBoxHeights(element);
    element.style.height = "".concat(expanded ? element.readmore.expandedHeight : element.readmore.collapsedHeight, "px");
  });
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
  sourceOrder: 'after',
  // callbacks
  blockProcessed: function blockProcessed() {},
  beforeToggle: function beforeToggle() {},
  afterToggle: function afterToggle() {}
};

var Readmore =
/*#__PURE__*/
function () {
  function Readmore() {
    var _this2 = this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Readmore);

    if (!isEnvironmentSupported()) return;

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var selector = args[0],
        options = args[1];
    var elements;

    if (typeof selector === 'string') {
      elements = document.querySelectorAll(selector);
    } else if (selector.nodeName) {
      elements = [selector]; // emulate a NodeList by casting a single Node as an array
    } else {
      elements = selector;
    } // After all that, if we _still_ don't have iteratable NodeList, bail out.


    if (!elements.length) return;
    this.options = extend({}, defaults, options);

    if (typeof selector === 'string') {
      embedCSS(selector, this.options);
    } else {
      // Instances need distinct selectors so they don't stomp on each other.
      this.instanceSelector = ".".concat(uniqueId());
      embedCSS(this.instanceSelector, this.options);
    } // Need to resize boxes when the page has fully loaded.


    window.addEventListener('load', resizeBoxes);
    window.addEventListener('resize', resizeBoxes);
    this.elements = [];
    forEach(elements, function (element) {
      if (_this2.instanceSelector) {
        element.classList.add(_this2.instanceSelector.substr(1));
      }

      var expanded = _this2.options.startOpen;
      element.readmore = {
        defaultHeight: _this2.options.collapsedHeight,
        heightMargin: _this2.options.heightMargin
      };
      setBoxHeights(element);
      var heightMargin = element.readmore.heightMargin;

      if (element.getBoundingClientRect().height <= element.readmore.collapsedHeight + heightMargin) {
        if (typeof _this2.options.blockProcessed === 'function') {
          _this2.options.blockProcessed(element, false);
        }

        return;
      }

      element.setAttribute('data-readmore', '');
      element.setAttribute('aria-expanded', expanded);
      element.id = element.id || uniqueId();
      var toggleLink = expanded ? _this2.options.lessLink : _this2.options.moreLink;
      var toggleElement = buildToggle(toggleLink, element, _this2);
      element.parentNode.insertBefore(toggleElement, _this2.options.sourceOrder === 'before' ? element : element.nextSibling);
      element.style.height = "".concat(expanded ? element.readmore.expandedHeight : element.readmore.collapsedHeight, "px");

      if (typeof _this2.options.blockProcessed === 'function') {
        _this2.options.blockProcessed(element, true);
      }

      _this2.elements.push(element);
    });
  } // Signature when called internally by the toggleLink click handler:
  //   toggle(element, event)
  //
  // When called externally by an instance,
  // e.g. readmoreDemo.toggle(document.querySelector('article:nth-of-type(1)')):
  //   toggle(elementOrQuerySelector)


  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Readmore, [{
    key: "toggle",
    value: function toggle() {
      var _this3 = this;

      var el = arguments.length <= 0 ? undefined : arguments[0];

      var toggleElement = function toggleElement(element) {
        var trigger = document.querySelector("[aria-controls=\"".concat(element.id, "\"]"));
        var expanded = element.getBoundingClientRect().height <= element.readmore.collapsedHeight;
        var newHeight = expanded ? element.readmore.expandedHeight : element.readmore.collapsedHeight; // Fire beforeToggle callback
        // Since we determined the new "expanded" state above we're now out of sync
        // with our true current state, so we need to flip the value of `expanded`

        if (typeof _this3.options.beforeToggle === 'function') {
          var shouldContinueToggle = _this3.options.beforeToggle(trigger, element, !expanded); // if the beforeToggle callback returns false, stop toggling


          if (shouldContinueToggle === false) {
            return;
          }
        }

        element.style.height = "".concat(newHeight, "px");

        var transitionendHandler = function transitionendHandler(transitionEvent) {
          // Fire afterToggle callback
          if (typeof _this3.options.afterToggle === 'function') {
            _this3.options.afterToggle(trigger, element, expanded);
          }

          transitionEvent.stopPropagation();
          element.setAttribute('aria-expanded', expanded);
          element.removeEventListener('transitionend', transitionendHandler, false);
        };

        element.addEventListener('transitionend', transitionendHandler, false);

        if (_this3.options.speed < 1) {
          transitionendHandler.call(_this3, {
            target: element
          });
        }

        var toggleLink = expanded ? _this3.options.lessLink : _this3.options.moreLink;

        if (!toggleLink) {
          trigger.remove();
        } else if (trigger && trigger.parentNode) {
          trigger.parentNode.replaceChild(buildToggle(toggleLink, element, _this3), trigger);
        }
      };

      if (typeof el === 'string') {
        el = document.querySelectorAll(el);
      }

      if (!el) {
        throw new Error('Element MUST be either an HTML node or querySelector string');
      }

      var event = arguments.length <= 1 ? undefined : arguments[1];

      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2___default()(el) === 'object' && !el.nodeName) {
        // element is likely a NodeList
        forEach(el, toggleElement);
      } else {
        toggleElement(el);
      }
    }
  }, {
    key: "destroy",
    value: function destroy(selector) {
      var _this4 = this;

      var elements;

      if (!selector) {
        elements = this.elements; // eslint-disable-line
      } else if (typeof selector === 'string') {
        elements = document.querySelectorAll(selector);
      } else if (selector.nodeName) {
        elements = [selector]; // emulate a NodeList by casting a single Node as an array
      } else {
        elements = selector;
      }

      forEach(elements, function (element) {
        if (_this4.elements.indexOf(element) === -1) {
          return;
        }

        _this4.elements = _this4.elements.filter(function (el) {
          return el !== element;
        });

        if (_this4.instanceSelector) {
          element.classList.remove(_this4.instanceSelector.substr(1));
        }

        delete element.readmore;
        element.style.height = 'initial';
        element.style.maxHeight = 'initial';
        element.removeAttribute('data-readmore');
        element.removeAttribute('aria-expanded');
        var trigger = document.querySelector("[aria-controls=\"".concat(element.id, "\"]"));

        if (trigger) {
          trigger.remove();
        }

        if (element.id.indexOf('rmjs-') !== -1) {
          element.removeAttribute('id');
        }
      });
      delete this;
    }
  }]);

  return Readmore;
}();

Readmore.VERSION = "3.0.0-beta-1";
/* harmony default export */ __webpack_exports__["default"] = (Readmore);

/***/ }),

/***/ 0:
/*!*******************************!*\
  !*** multi ./src/readmore.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/readmore.js */"./src/readmore.js");


/***/ })

/******/ })["default"];
});
//# sourceMappingURL=readmore.js.map