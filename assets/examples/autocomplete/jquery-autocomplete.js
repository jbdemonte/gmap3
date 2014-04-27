/**
 * Auto-complete plugin for jQuery
 * Licence  : GPL v3 : http://www.gnu.org/licenses/gpl.html
 * Author   : DEMONTE Jean-Baptiste
 * Contact  : jbdemonte@gmail.com
 * Url      : https://github.com/jbdemonte/autocomplete
 */
(function ($, undef) {

  //*************************************************
  // global variables
  //*************************************************
  var namespace = "autocomplete", // used to store the autocomplete object in $.data() and to create class name
    win = $(window),
    defaults = {
      ajax: { // options for $.ajax
        url: document.URL,
        type: "POST",
        dataType: "json",
        data: {}
      },
      cb: {                   // callback
        populate: undef,    // popupate data to send in $.ajax, if not define, data name is input name or id
        cast: undef,        // cast an item <mixed> to string in order to display it to the completion
        filter: undef,      // filtering function
        process: undef,     // after getting the result, it allows to manipulate data before displaying the completion
        preselect: undef,   // on highlight item
        select: undef,      // on select item
        unselect: undef,    // on validate a non item value
        force: undef        // enter on a non item (enter after an empty list)
      },
      width: "auto",          // auto : min-width = width of the input, false : width of the input else value
      offset: undef,               // display offset
      delay: 250,             // delay in ms after key pressed and before post
      name: undef,            // post key : name, else input[name], else input[id]
      minLength: 1,           // min lenght to complete : 0 / false : not used, > 0 : min length
      cache: true,            // ajax : cache result to save exchange
      once: false,            // ajax : false : idle, true : only require ajax exchange once => data source don't change : set filter to true if not defined in init
      source: undef,          // undef => ajax, [], string or callback function
      match: true,            // run match filter
      prefix: true,           // match by prefix of source data
      splitChr: undef,        // used character to split data (default is \n)
      autohide: false,        // autohide if not hover : 0 / false : not used, > 0 : delay in ms
      loop: true,             // up / down loop
      selectFirst: true,      // select first element on show
      className : namespace
    },
    ua = navigator.userAgent.toLowerCase(),
    opera = ua.match(/opera/),
    msie = ua.match(/msie/);

  //*************************************************
  // Mixed functions
  //*************************************************
  function clone(mixed) {
    var result;
    if ($.isArray(mixed)) {
      result = [];
      $.each(mixed, function (i, value) {
        result.push(value);
      });
    } else if (typeof mixed === "object") {
      result = $.extend(true, {}, mixed);
    } else {
      result = mixed;
    }
    return result;
  }

  // split data using splitChar or default
  function splitData(data, splitChr) {
    if (splitChr) {
      return data.split(splitChr);
    } else {
      return data.split(/\r\n|\r|\n/);
    }
  }

  //*************************************************
  // class Autocomplete
  //*************************************************
  function Autocomplete(element) {
    var toComplete, toAutoHide, // timeout
      dropbox,                // jQuery dropbox
      options = {},           // options of the autocomplete =  user define + default
      iHover = -1,            // index of highlighted element
      current,                // store current data to return real object instead of "toString" values
      keys = [],              // current keys
      count = 0,              // current count (item count in dropbox)
      cache = {},             // ajax cache => [ input value ] = ajax result
      binded = false,         // events on <input> are binded or not => enable / disable autocomplete
      scrolling = false,      // true before starting to scroll by using up / down key and false after onScroll event => needed to disable mouse over item event which highlight overed item
      handlers = {            // functions to bind
        key: keyPressed,
        focusout: function () {
          if (!$(this).data(namespace + "-focus")) {
            hide(true);
          }
        },
        dblclick: function () {
          if (!dropbox) {
            updateToComplete(false);
          }
        },
        resize: function () {
          if (dropbox) {
            relocate();
          }
        }
      };

    // run callback or return source
    function getSource(source) {
      if (typeof source === "function") {
        return getSource(source.call(element, element.val())); // result of the callback is re-processed (in case of result string ...)
      } else if (typeof source === "string") {
        return splitData(source, options.splitChr);
      }
      return source;
    }

    // bind events
    function bind() {
      if (!binded) {
        element[opera ? "keypress" : "keydown"](handlers.key);
        element.focusout(handlers.focusout);
        element.dblclick(handlers.dblclick);
        binded = true;
      }
    }

    // unbind events
    function unbind() {
      if (binded) {
        element.unbind(opera ? "keypress" : "keydown", handlers.key);
        element.unbind("focusout", handlers.focusout);
        element.unbind("dblclick", handlers.dblclick);
        binded = false;
      }
    }

    function relocate() {
      var offset = element.offset(),
        optOffset = typeof options.offset === "function" ? options.offset() : options.offset;
      dropbox.offset({
        top: offset.top + (optOffset && optOffset.top ? optOffset.top : element.outerHeight() + 1),
        left: offset.left + (optOffset && optOffset.left ? optOffset.left : 0)
      });
    }

    // restart the timeout to run autohide
    function updateToAutoHide() {
      if (!options.autohide) {
        return;
      }
      stopToAutoHide();
      toAutoHide = setTimeout(
        function () {
          hide(true);
        },
        options.autohide
      );
    }

    // stop the autohide
    function stopToAutoHide() {
      if (toAutoHide) {
        clearTimeout(toAutoHide);
        toAutoHide = undef;
      }
    }

    // restart the timeout to run the autocompletion
    function updateToComplete(noWait) {
      clearTimeout(toComplete);
      toComplete = setTimeout(
        complete,
        noWait ? 0 : options.delay
      );
    }

    // highlight on/off an item by its index (0..n-1)
    function hoverize(i, visible) {
      var li = dropbox ? $("li", dropbox).eq(i) : undef;
      if (li) {
        li[(visible ? "add" : "remove") + "Class"]("hover");
        if (visible) {
          scroll(li);
        }
      }
    }

    // scroll to make visible if needed the selected item
    function scroll(target) {
      var top = dropbox.scrollTop(),
        height = dropbox.innerHeight(),
        eTop = target.position().top,
        eHeight = target.outerHeight();
      if (eTop < 0) {
        scrolling = true;
        dropbox.scrollTop(top + eTop);
      } else if (eTop + eHeight > height) {
        scrolling = true;
        dropbox.scrollTop(top + eTop - height + eHeight);
      }
    }

    // locate next index to highlight
    function getPageUpDownItem(up) {
      if (!dropbox) {
        return false;
      }
      var height = dropbox.innerHeight(),
        pageCount = 0,
        next = iHover;

      // count visible element to process pageUp/Down
      $("li", dropbox).each(function () {
        var li = $(this);
        pageCount += (li.position().top >= 0) && (li.position().top + li.outerHeight() <= height) ? 1 : 0;
      });
      if (iHover < 0) { // not highlighted
        return (up ? count : pageCount) - 1; // up : last item, down : last of first pageCount
      }
      next += up ? -pageCount : pageCount;
      next = Math.max(0, next);
      next = Math.min(next, count - 1);
      if (options.loop && (next === iHover)) { // borders
        next = next === 0 ? count - 1 : 0;
      }
      return next;
    }

    // manage key pressed
    function keyPressed(e) {
      var next, li,
        c = e.which;
      if (c === 9) { // tab
        return;
      }
      if (!dropbox && (c !== 27) && (c !== 13)) { // completion empty and not [esc] or [enter]
        updateToComplete(false);
      } else if ((c === 38) || (c === 40)) { // up / down
        next = iHover + (c === 38 ? -1 : 1);
        if (options.loop) {
          if (next < 0) {
            next = count - 1;
          } else if (next > count - 1) {
            next = 0;
          }
        }
        next = Math.max(0, next);
        next = Math.min(next, count - 1);
        preselect(next);
        e.preventDefault();
      } else if ((c === 33) || (c === 34)) { // page up / down
        next = getPageUpDownItem(c === 33);
        if (next !== false) {
          preselect(next);
        }
        e.preventDefault();
      } else if (c === 13 || c === 39) { // enter or right arrow
        if (iHover !== -1) {
          li = $("li", dropbox).eq(iHover);
          select(iHover, options.cb.cast ? options.cb.cast(current[li.data("key")]) : li.text());
          e.preventDefault();
          e.stopImmediatePropagation();
        } else {
          hide(true);
          if (c === 13 && options.cb.force) {
            options.cb.force.call(element);
          }
        }
      } else if (c === 27) { // esc
        preselect(-1);
        hide(true);
      } else {
        updateToComplete(false);
      }
    }

    // create the data object to send in $.ajax
    function getData() {
      var data, name = "value";
      if (options.cb.populate) {
        data = $.extend(true, {}, options.ajax.data, options.cb.populate.call(element));
      } else {
        data = $.extend(true, {}, options.ajax.data);
        if (options.name && options.name.length) {
          name = options.name;
        } else if (element.attr("name") && element.attr("name").length) {
          name = element.attr("name");
        } else if (element.attr("id") && element.attr("id").length) {
          name = element.attr("id");
        }
        data[name] = element.val();
      }
      return data;
    }

    // branch complete : ajax or use local source
    function complete() {
      var value = element.val();
      // check min length required to run completion
      if (options.minLength && (options.minLength > value.length)) {
        if (hide(true)) {
          preselect(-1);
        }
        return;
      }
      if (options.source) {
        completeSource();
      } else {
        completeAjax();
      }
    }

    /**
     * filter data to match with user input
     * @param data {Array|Object}
     * @param cast {function}
     * @return {Object}
     */
    function matchFilter(data, cast) {
      var val = element.val(),
        re = new RegExp((options.prefix ? "^" : "") + val.replace(/[\-\[\]{}()*+?.,\\\^\$\|#\s]/g, "\\$&"), "i"), //escape regular expression
        result = [];
      // value is empty and minLenght is 0 (else, can't reach this filter)
      if (!val.length) {
        return data;
      }
      $.each(data, function (key, value) {
        if (re.test(cast(value))) {
          result.push(value);
        }
      });
      return result;
    }

    // run the completion : use local source
    function completeSource() {
      show(getSource(options.source), options.match);
    }

    // run the completion : use cache or call $.ajax
    function completeAjax() {
      var settings, data,
        value = element.val();

      // use cache if available
      if (cache && ((options.once && !$.isEmptyObject(cache)) || (options.cache && (typeof cache[value] !== "undefined")))) {
        data = options.once ? clone(cache) : clone(cache[value]);
        // user process
        if (options.cb.process) {
          data = options.cb.process.call(element, data, options.once ? "once" : "cache");
        }
        if (typeof data === "string") {
          data = splitData(data, options.splitChr);
        }
        show(data, options.match);
        return;
      }

      settings = $.extend(true, {}, options.ajax);
      settings.success = function (data, textStatus, jqXHR) {
        // store result if it will be re-used
        if (options.once) {
          cache = clone(data);
        } else if (options.cache) {
          cache[value] = clone(data);
        }
        // user process
        if (options.cb.process) {
          data = options.cb.process.call(element, data, textStatus, jqXHR);
        }
        if (typeof data === "string") {
          data = splitData(data, options.splitChr);
        }
        show(data, options.match);
      };

      settings.data = getData();
      $.ajax(settings);
    }

    // preselect an item (highlight : off the previous, on the new + run callback)
    function preselect(next) {
      var key;
      updateToAutoHide();
      if (iHover === next) {
        return;
      }
      hoverize(iHover, false);
      iHover = next;
      hoverize(iHover, true);
      if (options.cb.preselect) {
        if (iHover === -1) {
          options.cb.preselect.call(element);

        } else {
          key = keys[iHover];
          options.cb.preselect.call(element, current[key], key, iHover);
        }
      }
    }

    // select an item : select data in textbox, run the callback
    function select(i, value) {
      var key = keys[i];
      stopToAutoHide();
      if (value !== undef) {
        element.val(value);
      }
      hide();
      element.focus();
      if (options.cb.select) {
        options.cb.select.call(element, current[key], key, i);
      }
    }

    // use data receive from post or cache to display the selectbox
    function show(data, match) {
      var position = element.position(),
        width = msie ? element.outerWidth() : element.width(),
        cast = options.cb.cast || function (s) { return s; };

      hide();

      if (options.cb && options.cb.filter) {
        data = options.cb.filter(data);
      }

      if (!data) {
        return;
      }

      if ((typeof match === "undefined" && options.filter) || match) {
        data = matchFilter(data, cast);
      }

      current = data;

      dropbox = $(document.createElement("ul")).addClass(options.className);

      dropbox.css({
        position: "absolute",
        left: position.left + "px",
        top: (position.top + element.outerHeight()) + "px"
      });

      dropbox.scroll(function () {
        scrolling = false;
      });

      // adjust width
      if (options.width === "auto") {
        dropbox.css(msie ? "width" : "minWidth", width + "px");
      } else if (options.width === false) {
        dropbox.css({
          width: width + "px",
          overflow: "hidden"
        });
      } else {
        dropbox.css({
          width: typeof options.width === "function" ? options.width() : options.width,
          overflow: "hidden"
        });
      }

      // add items
      iHover = -1;
      count = 0;
      keys = [];
      $.each(current, function (key, value) {
        var li = $(document.createElement("li")),
          a = $(document.createElement("a")),
          i = count;
        a.click(function (event) {
          event.stopPropagation();
          select(i, cast(value));
        });
        li.data("key", key);
        li.click(function (event) {
          event.stopPropagation();
          select(i, cast(value));
        });
        li.hover(function () {
          if (!scrolling) { // on manual scrolling (up / down key), if mouse is over item, this event must be disable
            preselect(i);
          }
        });
        dropbox.append(li.append(a.append(cast(value, true))));
        keys[i] = key;
        count += 1;
      });

      if (!count) {
        dropbox.remove();
        return;
      }

      // while clicking on an item, element trigger the focusout, so the item click is lost
      dropbox.hover(
        function () {
          element.data(namespace + "-focus", true);
          stopToAutoHide();
        },
        function () {
          element.data(namespace + "-focus", false);
          updateToAutoHide();
          if (!element.is(":focus")) {
            element.trigger("focusout");
          }
        }
      );

      $("body").append(dropbox);
      win.on("resize", handlers.resize);
      relocate();

      // manage min-width, min-height, max-width, max-height for IE
      if (msie) {
        $.each(["min", "max"], function (isMax, type) {
          $.each(["Width", "Height"], function (i, property) {
            var v = parseInt(dropbox.css(type + property), 10);
            if (!isNaN(v) && ((dropbox[property.toLowerCase()]() < v) ^ isMax)) {
              dropbox.css(property.toLowerCase(), v + "px");
            }
          });
        });
      }
      if (options.selectFirst) {
        preselect(0);
      }

      updateToAutoHide();
    }

    // look for value in dropbox
    function reverse(value) {
      var result = undef;
      $("li", dropbox).each(function (i, li) {
        if (result === undef && $(li).text() === value) {
          result = i;
        }
      });
      return result;
    }

    // hide the select box
    function hide(checkReverse) {
      if (dropbox) {
        if (checkReverse) { // user escape or not select any item, but value is in the list, so run callback
          var value = element.val(),
            index = !value.length || (options.minLength && (options.minLength > value.length)) ? undef : reverse(value);
          if (index !== undef) {
            select(index);
            return false;
          }
        }
        if (iHover >= 0 && options.cb.unselect) {
          options.cb.unselect.call(element);
        }
        stopToAutoHide();
        dropbox.remove();
        win.off("resize", handlers.resize);
        dropbox = undef;
        iHover = -1;
        return true;
      }
      return false;
    }

    return {
      init: function (opts) {
        // extends defaults options
        options = $.extend(true, {}, defaults, opts);

        // initialise source data
        if (typeof options.source === "string") {
          options.source = splitData(options.source, options.splitChr);
        }

        // some browsers use key "down" to make their own autocompletion (Opera)
        element.attr("autocomplete", "off");

        // bind events
        bind();
      },
      flushCache: function () {
        cache = {};
      },
      enable: function () {
        bind();
      },
      disable: function () {
        unbind();
        preselect(-1);
        hide();
      },
      close: function () {
        hide();
      },
      trigger: function () {
        updateToComplete(true);
      },
      display: function (source, match) {
        show(getSource(source), match);
      }
    };
  }

  //*************************************************
  // Plugin jQuery
  //*************************************************
  $.fn.autocomplete = function (p1, p2, p3) {

    $.each(this, function () { // loop on each jQuery objects
      var element = $(this),
        current = element.data(namespace);

      if (!current) {
        current = new Autocomplete(element);
        element.data(namespace, current);
      }

      if (typeof p1 === "string" && current.hasOwnProperty(p1)) {
        current[p1](p2, p3);
      } else {
        current.init(p1);
      }
    });
    return this;
  };

}(jQuery));