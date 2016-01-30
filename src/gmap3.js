(function ($, window) {
  "use strict";

  var gm, services = {},

    // Proxify functions to get shorter minified code
    when = $.when,
    extend = $.extend,
    isArray = $.isArray,
    isFunction = $.isFunction,
    deferred = $.Deferred;

  /**
   * Slice an array like
   * @returns {Array}
   */
  function slice() {
    var fn = Array.prototype.slice,
      args = fn.call(arguments, 1);
    return fn.apply(arguments[0], args);
  }

  /**
   * Return true if value is undefined
   * @param value {*}
   * @returns {boolean}
   */
  function isUndefined(value) {
    return typeof value === 'undefined';
  }

  /**
   * Equivalent to Promise.all
   * @param deferreds {array} of {promise}
   * @returns {Deferred}
   */
  function all(deferreds) {
    return when.apply($, deferreds);
  }

  /**
   * Equivalent to Promise.resolve
   * @param value {*}
   * @returns {Deferred}
   */
  function resolved(value) {
    return when().then(function () {
      return value;
    });
  }

  // Auto-load google maps library if needed
  (function () {
    var dfd = deferred(),
      cbname = '__gmap3',
      script;

    $.holdReady(true);

    if (window.google && window.google.maps) {
      dfd.resolve();
    } else {
      // callback function - resolving promise after maps successfully loaded
      window[cbname] = function () {
        delete window[cbname];
        dfd.resolve();
      };
      script = window.document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?callback=' + cbname;
      $("head").append(script);
    }
    return dfd.promise();
  })().then(function () {
    $.holdReady(false);
  });

  /**
   * Instanciate only once a google service
   * @param name {string}
   * @returns {object}
   */
  function service(name) {
    if (!services[name]) {
      services[name] = gmElement(name);
    }
    return services[name];
  }

  /**
   * Return GoogleMap Class (or overwritten by user) instance
   * @param name {string}
   * @returns {object}
   */
  function gmElement(name) {
    var cls = gm[name];

    function F(args) {
      return cls.apply(this, args);
    }
    F.prototype = cls.prototype;

    return new F(slice(arguments, 1));
  }

  /**
   * Resolve a GeocodeRequest
   * https://developers.google.com/maps/documentation/javascript/geocoding
   * @param request {string|object}
   * @returns {Deferred}
   */
  function geocode(request) {
    var dfd = deferred();
    if (typeof request === 'string') {
      request = {
        address: request
      };
    }
    service('Geocoder').geocode(request, function(results, status) {
      if (status == gm.GeocoderStatus.OK) {
        dfd.resolve(results[0].geometry.location);
      } else {
        dfd.reject();
      }
    });
    return dfd;
  }

  /**
   * Split string a execute a function on each item
   * @param str {string} space separated list of string concatenated
   * @param fn {function(item:string)}
   */
  function foreachStr(str, fn) {
    str.split(' ').forEach(fn);
  }

  /**
   * execute a function on each items if items is an array and on items as a single element if it is not an array
   * @param items {array|*} space separated list of string concatenated
   * @param fn {function(*)}
   */
  function foreach(items, fn) {
    (isArray(items) ? items : [items]).forEach(fn);
  }

  /**
   * convert bounds from array [ n, e, s, w ] to google.maps.LatLngBounds
   * @param options {Object} container of options.bounds
   * @param fn {function(options)}
   * @returns {Deferred}
   */
  function resolveLatLngBounds(options, fn) {
    options = options ? extend(true, {}, options) : {}; // never modify original object
    var bounds = options.bounds;
    if (bounds) {
      if (isArray(bounds)) {
        options.bounds = gmElement('LatLngBounds', {lat: bounds[2], lng: bounds[3]}, {lat: bounds[0], lng: bounds[1]});
      } else if (!bounds.getCenter){
        options.bounds = gmElement('LatLngBounds', {lat: bounds.south, lng: bounds.west}, {lat: bounds.north, lng: bounds.east});
      }
    }
    return resolved(fn(options));
  }

  /**
   * Resolve an address location / convert a LatLng array to google.maps.LatLng object
   * @param options {object}
   * @param key {string} LatLng key name in options object
   * @param fn {function(options)}
   * @returns {Deferred}
   */
  function resolveLatLng(options, key, fn) {
    var dfd = deferred();
    options = options ? extend(true, {}, options) : {}; // never modify original object
    when()
      .then(function () {
        var address = options.address;
        if (address) {
          options = extend(true, {}, options); // never modify original object
          delete options.address;
          return geocode(address).then(function (latLng) {
            options[key] = latLng;
          })
        }
        options[key] = toLatLng(options[key]);
      })
      .then(function () {
        dfd.resolve(fn(options));
      });
    return dfd;
  }

  /**
   * convert an array of mixed LatLng to google.maps.LatLng object
   * No address resolution here
   * @param options {object}
   * @param key {string} Array key name in options object
   * @param fn {function(options, latLng)} where latLng is the first one
   * @returns {Deferred}
   */
  function resolveArrayOfLatLng(options, key, fn) {
    options = options ? extend(true, {}, options) : {}; // never modify original object
    options[key] = (options[key] || []).map(function (item) {
      return toLatLng(item);
    });
    return resolved(fn(options, options[key][0]));
  }

  /**
   * Convert a LatLng array to google.maps.LatLng iff mixed is an array
   * @param mixed {*}
   * @returns {*}
   */
  function toLatLng(mixed) {
    return isArray(mixed) ? gmElement('LatLng', mixed[0], mixed[1]) : mixed;
  }

  /**
   * jQuery Plugin
   */
  $.fn.gmap3 = function (options) {
    var items = [];
    gm = window.google.maps; // once gmap3 is loaded, google.maps library should be loaded
    this.each(function () {
      var $this = $(this), gmap3 = $this.data("gmap3");
      if (!gmap3) {
        gmap3 = new Gmap3($this, options);
        $this.data("gmap3", gmap3);
      }
      items.push(gmap3);
    });

    return new Handler(this, items);
  };

  /**
   * Class Handler
   * Chainable objet which handle all Gmap3 items associated to all jQuery elements in the current command set
   * @param chain {jQuery} "this" to return to maintain the jQuery chain
   * @param items {Array} of {Gmap3}
   * @constructor
   */
  function Handler(chain, items) {
    var self = this;

    // Map all functions from Gmap3 class
    Object.keys(items[0]).forEach(function (name) {
      self[name] = function () {
        var results = [],
          args = slice(arguments);
        items.forEach(function (item) {
          results.push(item[name].apply(item, args));
        });
        return name === 'get' ? (results.length > 1 ? results : results[0]) : self;
      };
    });

    self.$ = chain;
  }

  /**
   * Class Gmap3
   * Handle a Google.maps.Map instance
   * @param $container {jQuery} Element to display the map in
   * @param options {object} MapOptions
   * @constructor
   */
  function Gmap3($container, options) {
    var map,
      previousResults = [],
      promise = when(),
      self = this;

    function context() {
      return {
        $: $container,
        get: self.get
      };
    }

    /**
     * Decorator to handle multiple call based on array of options
     * @param fn {function(?)}
     * @returns {Deferred}
     */
    function multiple(fn) {
      return function (options) {
        if (isArray(options)) {
          var instances = [];
          var promises = options.map(function (opts) {
            return fn.call(self, opts).then(function (instance) {
              instances.push(instance);
            });
          });
          return all(promises).then(function () {
            previousResults.push(instances);
            return instances;
          });
        } else {
          return fn.apply(self, arguments).then(function (instance) {
            previousResults.push(instance);
            return instance;
          });
        }
      }
    }

    /**
     * Decorator to chain promise result onto the main promise chain
     * @param fn {function(?)}
     * @returns {Deferred}
     */
    function chainToPromise(fn) {
      return function () {
        var args = slice(arguments);
        return promise = promise.then(function () {
          if (isFunction(args[0])) {
            // handle return as a deferred / promise to support both sync & async result
            return when(args[0].apply(context(), previousResults.slice(-1))).then(function (value) { // voir si on branche ici, car s'il retourne la promise d'un this.marker() => loop oO
              args[0] = value;
              return fn.apply(self, args);
            });
          }

          return when(fn.apply(self, args));
        });
      };
    }

    self.map = chainToPromise(function (options) {
      return map || resolveLatLng(options, 'center', function (opts) {
          map = gmElement('Map', $container.get(0), opts);
          previousResults.push(map);
          return map;
        });
    });

    // Space separated string of : separated element
    // (google.maps class name) : (latLng property name) : (add map - 0|1 - default = 1)
    foreachStr('Marker:position Circle:center InfoWindow:position:0 Polyline:path Polygon:paths', function (item) {
      item = item.split(':');
      var property = item[1] || '';
      self[item[0].toLowerCase()] = chainToPromise(multiple(function (options) {
        return (property.match(/^path/) ? resolveArrayOfLatLng : resolveLatLng)(options, property, function (opts) {
          if (item[2] !== '0') {
            opts.map = map;
          }
          return gmElement(item[0], opts);
        });
      }));
    });

    self.rectangle = chainToPromise(multiple(function (options) {
      return resolveLatLngBounds(options, function (opts) {
        opts.map = map;
        return gmElement('Rectangle', opts);
      });
    }));

    self.then = function (fn) {
      if (isFunction(fn)) {
        promise = promise.then(function (instance) {
          return when(fn.call(context(), instance)).then(function (newInstance) {
            return isUndefined(newInstance) ? instance : newInstance;
          });
        });
      }
    };

    foreachStr('on once', function (name) {
      self[name] = function () {
        var data = arguments[0];
        if (data) {
          if (typeof data === 'string') { // cast call on('click', handler) to on({click: handler})
            data = {};
            data[arguments[0]] = slice(arguments, 1);
          }
          promise.then(function (instances) {
            if (instances) {
              $.each(data, function (eventName, handlers) {
                foreach(instances, function (instance) {
                  gm.event['addListener' + (name === 'once' ? 'Once' : '')](instance, eventName, function (event) {
                    foreach(handlers, function (handler) {
                      if (isFunction(handler)) {
                        handler.call(context(), instance, event);
                      }
                    });
                  });
                });
              });
            }
          });
        }
      };
    });

    self.get = function (index) {
      if (isUndefined(index)) {
        return previousResults.map(function (instance) {
          return isArray(instance) ? instance.slice() : instance;
        });
      } else {
        return isArray(previousResults[index]) ? previousResults[index].slice() : previousResults[index];
      }
    };

    if (options) {
      self.map(options);
    }
  }

})(jQuery, window);