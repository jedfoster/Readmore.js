/*!
 * Readmore.js jQuery plugin
 * Author: @jed_foster
 * Project home: jedfoster.github.io/Readmore.js
 * Licensed under the MIT license
 *
 * Debounce function from http://davidwalsh.name/javascript-debounce-function
 */

;(function($) {

  var readmore = 'readmore',
      defaults = {
        speed: 100,
        maxHeight: 200,
        heightMargin: 16,
        moreLink: '<a href="#">Read More</a>',
        lessLink: '<a href="#">Close</a>',
        embedCSS: true,
        sectionCSS: 'display: block; width: 100%;',
        startOpen: false,

        // callbacks
        beforeToggle: function(){},
        afterToggle: function(){}
      },
      cssEmbedded = {};

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  function Readmore( element, options ) {
    this.element = element;

    this.options = $.extend( {}, defaults, options);

    $(this.element).data('max-height', this.options.maxHeight);
    $(this.element).data('height-margin', this.options.heightMargin);

    delete(this.options.maxHeight);

    if(! cssEmbedded[this.options.selector]) {
      var styles = ' ';

      // Include sectionCSS if embedCSS is true
      if(this.options.embedCSS) {
        styles += this.options.selector + ' + [readmore-js-toggle], ' + this.options.selector + '[data-readmore-js-section]{' + this.options.sectionCSS + '}'
      }

      // Include the transition CSS even if embedCSS is false
      styles += this.options.selector + '[data-readmore-js-section]{' +
        'transition: height ' + this.options.speed + 'ms;' +
        'overflow: hidden;' +
      '}';

      (function(d,u) {
        var css=d.createElement('style');
        css.type = 'text/css';
        if(css.styleSheet) {
            css.styleSheet.cssText = u;
        }
        else {
          css.appendChild(d.createTextNode(u));
        }
        d.getElementsByTagName('head')[0].appendChild(css);
      }(document, styles));

      cssEmbedded[this.options.selector] = true;
    }

    this._defaults = defaults;
    this._name = readmore;

    this.init();
  }

  Readmore.prototype = {

    init: function() {
      var $this = this;

      $(this.element).each(function() {
        var current = $(this),
            maxHeight = (parseInt(current.css('max-height').replace(/[^-\d\.]/g, ''), 10) > current.data('max-height')) ? parseInt(current.css('max-height').replace(/[^-\d\.]/g, ''), 10) : current.data('max-height'),
            heightMargin = current.data('height-margin');

        if(current.css('max-height') != 'none') {
          current.css('max-height', 'none');
        }

        $this.setBoxHeight(current);

        if(current.outerHeight(true) <= maxHeight + heightMargin) {
          // The block is shorter than the limit, so there's no need to truncate it.
          return true;
        }
        else {

          var useLink = $this.options.startOpen ? $this.options.lessLink : $this.options.moreLink;
          current.attr({'data-readmore-js-section': '', 'aria-expanded': false}).data('collapsedHeight', maxHeight);

          current.after($(useLink).on('click', function(event) { $this.toggleSlider(this, current, event) }).attr('data-readmore-js-toggle', ''));

          if(!$this.options.startOpen) {
            current.css({height: maxHeight});
          }
        }
      });

      window.addEventListener('resize', function(event) {
        $this.resizeBoxes();
      });
    },

    toggleSlider: function(trigger, element, event)
    {
      event.preventDefault();

      var $this = this,
          $element = $(element),
          $trigger = $(trigger),
          newHeight = newLink = '',
          expanded = false,
          collapsedHeight = $element.data('collapsedHeight');

      if ($element.height() <= collapsedHeight) {
        newHeight = $element.data('expandedHeight') + 'px';
        newLink = 'lessLink';
        expanded = true;
      }

      else {
        newHeight = collapsedHeight;
        newLink = 'moreLink';
      }

      // Fire beforeToggle callback
      $this.options.beforeToggle(trigger, element, expanded);

      $element.css({'height': newHeight});

      // Fire afterToggle callback
      $element.on('transitionend', function(e) {
        $this.options.afterToggle(trigger, element, expanded);

        $(this).attr('aria-expanded', expanded);
      });

      $trigger.replaceWith($($this.options[newLink]).on('click', function(event) { $this.toggleSlider(this, element, event) }).attr('data-readmore-js-toggle', ''));
    },

    setBoxHeight: function(element) {
      var el = element.clone().css({'height': 'auto', 'width': element.width(), 'overflow': 'hidden'}).insertAfter(element),
          height = el.outerHeight(true);

      el.remove();

      element.data('expandedHeight', height);
    },

    resizeBoxes: debounce(function() {
      var $this = this;

      $('[data-readmore-js-section]').each(function() {
        var current = $(this);

        $this.setBoxHeight(current);

        if(current.height() > current.data('expandedHeight') || (current.attr('aria-expanded') && current.height() < current.data('expandedHeight')) ) {
          current.css('height', current.data('expandedHeight'));
        }
      });
    }, 100),

    destroy: function() {
      var $this = this;

      $(this.element).each(function() {
        var current = $(this);

        current.attr({'data-readmore-js-section': null, 'aria-expanded': null }).css({'max-height': '', 'height': ''}).next('[data-readmore-js-toggle]').remove();

        current.removeData();
      });
    }
  };

  $.fn.readmore = function( options ) {
    var args = arguments,
        selector = this.selector;
    if (options === undefined || typeof options === 'object') {
      return this.each(function () {
        if ($.data(this, 'plugin_' + readmore)) {
          var instance = $.data(this, 'plugin_' + readmore);
          instance['destroy'].apply(instance);
        }

        options['selector'] = selector;

        $.data(this, 'plugin_' + readmore, new Readmore( this, options ));
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
      return this.each(function () {
        var instance = $.data(this, 'plugin_' + readmore);
        if (instance instanceof Readmore && typeof instance[options] === 'function') {
          instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
        }
      });
    }
  };
})(jQuery);
