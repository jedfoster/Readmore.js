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
      };

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

        if(current.css('max-height') != "none") {
          current.css("max-height", "none");
        }

        current.data("boxHeight", current.height());

        if(current.innerHeight() < maxHeight) {
          // The block is shorter than the limit, so there's no need to truncate it.
          return true;
        }
        else {
          current.after($($this.options.moreLink).on('click', function(event) { $this.openSlider(this, current, event) }));
        }

        sliderHeight = maxHeight;

        current.css("height", sliderHeight).css("overflow", 'hidden');
      });
    },

    openSlider: function(trigger, element, event)
    {
      event.preventDefault();

      var $this = this,
          open_height = $(element).data().boxHeight + "px";

      $(element).animate({"height": open_height}, {duration: $this.options.speed });

      $(trigger).replaceWith($($this.options.lessLink).on('click', function(event) { $this.closeSlider(this, element, event) }));
    },

    closeSlider: function(trigger, element, event)
    {
      event.preventDefault();

      var $this = this;

      $(element).animate({"height": sliderHeight}, {duration: $this.options.speed });

      $(trigger).replaceWith($($this.options.moreLink).on('click', function(event) { $this.openSlider(this, element, event) }));
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