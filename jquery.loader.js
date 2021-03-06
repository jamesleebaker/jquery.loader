(function($) {
  var
  defaults = {
    overlay: true,
    forcePosition: true,
    centerSpinner: true,
    size: null,
    loaderClassName: 'loader',
    overlayClassName: 'overlay',
    spinnerClassName: 'spinner',
    width: 'parent',
    height: 'parent',
    loaderTemplate: '<div class="{loaderClassName}"></div>',
    spinnerTemplate: '<span class="{spinnerClassName}"></span>'
  },
    methods;

  // static methods

  methods = {
    /**
     * Destroys the loader, its settings state, and the DOM elements
     * for the loader
     * @returns {*}
     */
    destroy: function() {
      return this.each(function() {
        var $element = $(this),
          settings = $element.data('_state');

        if (settings) {
          $element.find('.' + settings.loaderClassName).remove();
          $.removeData(this);
        }
      });
    },

    /**
     * Repositions the loader to the desired CSS rules
     * These rules must be CSS rules in a key/value object
     * @param {Object}  positions   The CSS rules to apply to the loader
     * @returns {*}
     */
    position: function(positions) {
      if (typeof positions !== 'object') {
        return this;
      }

      return this.each(function() {
        var settings = $(this).data('_state');

        if (settings) {
          $(this).find('.' + settings.loaderClassName).css(positions);
        }
      });
    },

    reposition: function() {
      return this.each(function() {
        var settings = $(this).data('_state'),
          $parent = $(this),
          $loader = $(this).find('.' + settings.loaderClassName),
          $spinner = $loader.find('.' + settings.spinnerClassName),
          elementPosition = $parent.css('position');

        if (elementPosition !== 'relative' || elementPosition !== 'absolute') {
          if (settings.forcePosition) {
            $parent.css('position', 'relative');
          }
        }

        $loader.css({
          width: settings.width === 'parent' ? $parent.innerWidth() : settings.width,
          height: settings.height === 'parent' ? $parent.innerHeight() : settings.height
        });

        if (settings.centerSpinner) {
          $spinner.css({
            top: ($loader.innerHeight() - $spinner.height()) / 2,
            left: ($loader.innerWidth() - $spinner.width()) / 2
          });
        }
      });
    },
    /**
     * Hides the loader from being visible
     * @returns {*}
     */
    hide: function() {
      return this.each(function() {
        var $element = $(this),
          settings = $element.data('_state');

        if (settings) {
          $element.find('.' + settings.loaderClassName).hide();
        }
      });
    },

    /**
     * Shows the loader (from being previously hidden)
     * @returns {*}
     */
    show: function() {
      return this.each(function() {
        var $element = $(this),
          settings = $element.data('_state');

        if (settings) {
          $element.find('.' + settings.loaderClassName).show();
        }
      });
    }
  };


  /**
   * Composes the plugin markup from the provided templates and applies the positioning styles
   * based on the settings provided
   * @param {jQuery}  $parent   The jQuery element of the parent container. Passed in to calculate relative styles
   * @param {Object}  settings  The settings of the plugin
   * @returns {*}
   * @private
   */
  function _compose($parent, settings) {
    var loader = settings.loaderTemplate.replace('{loaderClassName}', settings.loaderClassName),
      spinner = settings.spinnerTemplate.replace('{spinnerClassName}', settings.spinnerClassName),
      $loader = $(loader).append(spinner),
      $spinner = $loader.find('.' + settings.spinnerClassName),
      elementPosition = $parent.css('position');

    if (elementPosition !== 'relative' || elementPosition !== 'absolute') {
      if (settings.forcePosition) {
        $parent.css('position', 'relative');
      }
    }

    $loader.css({
      width: settings.width === 'parent' ? $parent.innerWidth() : settings.width,
      height: settings.height === 'parent' ? $parent.innerHeight() : settings.height
    });

    if (settings.overlay) {
      $loader.addClass(settings.overlayClassName);
    }

    $loader.appendTo($parent);

    if (settings.size) {
      $spinner.addClass(settings.size);
    }

    if (settings.centerSpinner) {
      $spinner.css({
        position: 'absolute',
        top: ($loader.innerHeight() - $spinner.height()) / 2,
        left: ($loader.innerWidth() - $spinner.width()) / 2
      });
    }

    return $loader;
  }

  /**
   * The constructor of the plugin
   * @param {Object}  options The options to override the default settings (see top of file)
   * @returns {*}
   * @private
   */
  function _init(options) {
    return this.each(function() {
      var $container = $(this),
        self = this,
        settings = $.extend({}, defaults, options);

      if ($container.children('.' + settings.loaderClassName).length) {
        return this;
      }

      _compose($container, settings);
      $container.data('_state', settings);

      $(window).on('resize', function(event) {
        methods.reposition.call($container);
      });
    });
  }

  /**
   * The jQuery extension
   * @param {String|Object} method  The method to call or the settings to provide to
   *                                override the defaults
   * @returns {*}
   */
  $.fn.loader = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }

    if (typeof method === 'object' || !method) {
      return _init.apply(this, arguments);
    }

    $.error('Method ' + method + ' does not exist on jQuery.loader');
  };

}(jQuery));