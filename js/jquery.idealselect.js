;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function($, doc, win){
  var plugin;
  plugin = {};
  plugin.name = 'idealselect';
  plugin.methods = {
    _init: function(){
      this.select$ = $(this.el);
      this.options$ = this.select$.find('option');
      this.select$.css({
        position: 'absolute',
        left: '-9999px'
      }).attr('tabindex', -1);
      this._build();
      return this._events();
    },
    _build: function(){
      var default$;
      default$ = this.options$.filter(':selected');
      this.items$ = $(this.options$.map(function(){
        return "<li>" + $(this).text() + "</li>";
      }).get().join(''));
      this.items$.eq(default$.index()).addClass('selected');
      this.title$ = $("<a href=\"#\" class=\"title\" tabindex=\"-1\">\n  <span>" + default$.text() + "</span>\n  <i/>\n</a>");
      this.dropdown$ = $('<ul class="dropdown"></ul>').append(this.items$);
      this.idealselect$ = $("<div class=\"idealselect\" tabindex=\"0\">\n  <ul>\n    <li></li>\n  </ul>\n</div>");
      return this.idealselect$.find('li').append(this.title$, this.dropdown$).end().insertAfter(this.select$);
    },
    _update: function(index){
      this.options$.eq(index).prop('selected', true);
      this.idealselect$.find('.title span').text(this.items$.eq(index).text());
      return this.items$.removeClass('selected').eq(index).addClass('selected');
    },
    _scroll: function(index){
      var item$, height, position;
      if (index) {
        item$ = this.items$.eq(index);
        height = this.dropdown$.height();
        position = item$.position().top;
        if (position >= height) {
          item$.get(0).scrollIntoView();
        }
        if (position < 0) {
          return item$.get(0).scrollIntoView(false);
        }
      } else {
        return this.items$.filter('.selected').get(0).scrollIntoView();
      }
    },
    _events: function(){
      var this$ = this;
      this.select$.change(function(e){
        return this$._update($(e.target).find(':selected').index());
      });
      this.title$.click(function(e){
        e.preventDefault();
        this$.idealselect$.focus().toggleClass('open');
        return this$._scroll();
      });
      this.items$.click(function(e){
        this$._update($(e.target).index());
        this$.idealselect$.removeClass('open');
        return this$.select$.change();
      });
      return this.idealselect$.mousedown(function(it){
        return it.preventDefault();
      }).focus(function(){
        return this$.select$.triggerHandler('focus');
      }).blur(function(){
        this$.idealselect$.removeClass('open');
        return this$.select$.blur();
      }).keydown(function(e){
        var index, letter, matches$, first, next, scrollNow;
        index = this$.options$.filter(':selected').index();
        switch (e.which) {
        case 13:
          this$.idealselect$.toggleClass('open');
          break;
        case 38:
          if (index - 1 > -1) {
            index = index - 1;
          }
          break;
        case 40:
          if (index + 1 < this$.items$.length) {
            index = index + 1;
          }
          break;
        default:
          letter = String.fromCharCode(e.which);
          if (/\w/.exec(letter)) {
            matches$ = this$.items$.filter(function(){
              return $(this).text().indexOf(letter) === 0;
            });
            first = matches$.index();
            next = matches$.slice(matches$.index(matches$.filter('.selected')) + 1, matches$.length).index();
            index = next > -1 ? next : first;
            scrollNow = true;
          }
        }
        if (index > -1) {
          this$._update(index);
          this$._scroll(scrollNow ? 0 : index);
          this$.select$.change();
        }
        return $(doc).one('keydown', function(e){
          if (e.which === 38 || e.which === 40) {
            return e.preventDefault();
          }
        });
      });
    }
  };
  require('./plugin')(plugin);
}.call(this, jQuery, document, window));
},{"./plugin":2}],2:[function(require,module,exports){
/**
 * Plugin boilerplate
 */
module.exports = (function() {

  var AP = Array.prototype;

  return function(plugin) {

    plugin = $.extend(true, {
      name: 'plugin',
      defaults: {},
      methods: {},
      global: {},
    }, plugin);

    function Plugin(element, options) {

      this.opts = $.extend({}, plugin.defaults, options);
      this.el = element;

      this._name = plugin.name;

      this._init();
    }

    Plugin.prototype._init = $.noop;

    Plugin.prototype[plugin.name] = function(method) {
      if (!method) return this;
      try { return this[method].apply(this, AP.slice.call(arguments, 1)); }
      catch(e) {}
    };

    $.extend(Plugin.prototype, plugin.methods);

    $.fn[plugin.name] = function() {

      var args = AP.slice.call(arguments)
        , methodArray = typeof args[0] == 'string' && args[0].split(':')
        , method = methodArray[methodArray.length > 1 ? 1 : 0]
        , prefix = methodArray.length > 1 && methodArray[0]
        , opts = typeof args[0] == 'object' && args[0]
        , params = args.slice(1)
        , ret;

      if (prefix) {
        method = prefix + method.substr(0,1).toUpperCase() + method.substr(1,method.length-1);
      }

      this.each(function() {

        var instance = $.data(this, plugin.name);

        // Method
        if (instance) {
          return ret = instance[plugin.name].apply(instance, [method].concat(params));
        }

        // Init
        return $.data(this, plugin.name, new Plugin(this, opts));
      });

      return prefix ? ret : this;
    };
  };

}());

},{}]},{},[1])
;