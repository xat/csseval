!function($) {
  var $window = $(window);

  $.csseval = {

    triggers: {
      scroll: function(run) {
        $window.scroll(run);
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
      }
    }
  };

  var Widget = function($el, scope) {
    var cssTemplate = $el.data('css');
    var trigger = $el.data('trigger');
    var expressions = [];
    var exprRegex = /`(.*?)`/g;
    var exprRegexOuter = /`.*?`/;
    var localScope = {};
    var match;
    var run;
    var fn;

    // extract all expressions
    while(match = exprRegex.exec(cssTemplate)) {
      expressions.push(match[1]);
    }

    // replace expressions with some placeholders
    $.each(expressions, function(k) {
      cssTemplate = cssTemplate.replace(exprRegexOuter, '[[[' + k + ']]]');
    });

    // copy all scope methods to localScope and
    // bind $el as first argument
    $.each(scope, function(k, fn) {
      localScope[k] = $.proxy(fn, null, $el);
    });

    // prefix all functions on scope with 'this.'
    expressions = $.map(expressions, function(val) {
      $.each(localScope, function(k) {
        val = val.replace(new RegExp(k + "\s*?\\((.*?)\\)", 'g'), "this." + k + "($1)");
      });
      return val;
    });

    // replace placeholders with the build expressions
    $.each(expressions, function(k, str) {
      cssTemplate = cssTemplate.replace('[[[' + k + ']]]', '\' + ' + str + '+ \'');
    });

    // create the actual function
    fn = new Function('"use strict"; return ' + cssTemplate);
    fn = fn.bind(localScope);

    run = function() {
      $el.css(fn());
    };

    if ($.csseval.triggers[trigger]) {
      $.csseval.triggers[trigger](run);
    }
  };

  $.fn.csseval = function() {
    return this.each(function(scope) {
      var $el = $(this);
      if ($el.data('csseval')) return;
      Widget($el, $.extend($.csseval.scope, scope || {}));
      $el.data('csseval', true);
    });
  };

}(jQuery);