/*!
 * Readmore.js jQuery plugin
 * Author: @jed_foster
 * Project home: jedfoster.github.io/Readmore.js
 * Licensed under the MIT license
 */

;(function($) {

  var readmore = 'readmore',
      defaults = {
        speed: 100,
        maxHeight: 200,
        moreLink: '<a href="#">Read More</a>',
        lessLink: '<a href="#">Close</a>'
      },

      styles = '.readmore-js-toggle, .readmore-js-section { display: block; width: 100%; }\
.readmore-js-section { overflow: hidden; }';

    (function(d,u) {
      if(d.createStyleSheet) {
        d.createStyleSheet( u );
      }
      else {
        var css=d.createElement('style');
        css.appendChild(document.createTextNode(u));
        d.getElementsByTagName("head")[0].appendChild(css);
      }
    }(document, styles));

  function Readmore( element, options ) {
    this.element = element;

    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = readmore;

    this.init();
  }

  Readmore.prototype = {

    init: function() {
      var $this = this;

      $(this.element).each(function() {
        var current = $(this),
            maxHeight = (current.css('max-height').replace(/[^-\d\.]/g, '') > $this.options.maxHeight) ? current.css('max-height').replace(/[^-\d\.]/g, '') : $this.options.maxHeight;

        current.addClass('readmore-js-section');

        if(current.css('max-height') != "none") {
          current.css("max-height", "none");
        }

        current.data("boxHeight", current.outerHeight(true));

        if(current.outerHeight(true) < maxHeight) {
          // The block is shorter than the limit, so there's no need to truncate it.
          return true;
        }
        else {
          current.after($($this.options.moreLink).on('click', function(event) { $this.toggleSlider(this, current, event) }).addClass('readmore-js-toggle'));
        }

        sliderHeight = maxHeight;

        current.css({height: sliderHeight});
      });
    },

    toggleSlider: function(trigger, element, event)
    {
      event.preventDefault();

      var $this = this,
          newHeight = newLink = '';

      if ($(element).height() == sliderHeight) {
        newHeight = $(element).data().boxHeight + "px";
        newLink = 'lessLink';
      }

      else {
        newHeight = sliderHeight;
        newLink = 'moreLink';
      }

      $(element).animate({"height": newHeight}, {duration: $this.options.speed });

      $(trigger).replaceWith($($this.options[newLink]).on('click', function(event) { $this.toggleSlider(this, element, event) }).addClass('readmore-js-toggle'));
    }
  };

  $.fn[readmore] = function( options ) {
    var args = arguments;
    if (options === undefined || typeof options === 'object') {
      return this.each(function () {
        if (!$.data(this, 'plugin_' + readmore)) {
          $.data(this, 'plugin_' + readmore, new Readmore( this, options ));
        }
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
      return this.each(function () {
        var instance = $.data(this, 'plugin_' + readmore);
        if (instance instanceof Readmore && typeof instance[options] === 'function') {
          instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
        }
      });
    }
  }
})(jQuery);
