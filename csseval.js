!function($) {
  var $window = $(window);

  $.csseval = {

    triggers: {
      scroll: function(run, $el) {
        $window.on('scroll', run);
        $el.one('csseval:destroy', function() {
          $window.off('scroll', run);
        });
      }
    },

    scope: {
      offsetLeft: function($el) {
        return $el.offset().left;
      },
      offsetTop: function($el) {
        return $el.offset().top;
      },
      width: function($el) {
        return $el.width();
      },
      height: function($el) {
        return $el.height();
      },
      scrollTop: function() {
        return $(document).scrollTop();
      },
      css: function($el, prop) {
        return $el.css(prop);
      },
      data: function($el, prop) {
        return $el.data(prop);
      }
    }
  };

  var Widget = function($el, scope) {
    var cssTemplate = $el.data('css');
    var triggers = $el.data('trigger');
    var localScope = {};
    var run;
    var fn;

    triggers = triggers ? triggers.split(',') : [];

    // copy all scope methods to localScope and
    // bind $el as first argument
    $.each(scope, function(k, fn) {
      localScope[k] = $.proxy(fn, null, $el);
    });

    // create the actual function
    fn = new Function('"use strict"; return ' + cssTemplate);
    fn = fn.bind(localScope);

    run = function() {
      $el.css(fn());
    };

    $.each(triggers, function(k, trigger) {
      trigger = $.trim(trigger);
      if ($.csseval.triggers[trigger]) {
        $.csseval.triggers[trigger](run, $el);
      }
    });

    return {
      destroy: function() {
        $el.trigger('csseval:destroy');
        $el.removeData('csseval');
      },
      run: run
    };
  };

  $.fn.csseval = function() {
    return this.each(function(scope) {
      var $el = $(this);
      var api;
      if ($el.data('csseval')) return;
      api = Widget($el, $.extend({}, $.csseval.scope, scope || {}));
      $el.data('csseval', api);
    });
  };

}(jQuery);
