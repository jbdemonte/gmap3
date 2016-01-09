(function ($, window) {
  var gm, services = {},

    // Proxify functions to get shorter minified code
    arraySlice = Array.prototype.slice,
    when = $.when,
    extend = $.extend,
    arrayMap = $.map,
    isArray = $.isArray,
    isFunction = $.isFunction,
    deferred = $.Deferred,
    all = function (deferreds) {
      return when.apply($, deferreds);
    };

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

    return new F(arraySlice.call(arguments, 1));
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
   * Uppercase first letter of a string
   * @param str {string}
   * @returns {string}
   */
  function ucFirst(str) {
    return str[0].toUpperCase() + str.substr(1);
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
   * convert bounds from array [ n, e, s, w ] to google.maps.LatLngBounds
   * @param options {Object} container of options.bounds
   * @param fn {function(options, latLng)}
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
    return when().then(function () {
      return fn(options, bounds ? options.bounds.getCenter() : null);
    })
  }

  /**
   * Resolve an address location / convert a LatLng array to google.maps.LatLng object
   * @param options {object}
   * @param key {string} LatLng key name in options object
   * @param fn {function(options, latLng)}
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
        if (isArray(options[key])) {
          options[key] = gmElement('LatLng', options[key][0], options[key][1]);
        }
      })
      .then(function () {
        dfd.resolve(fn(options, options[key]));
      });
    return dfd;
  }

  /**
   * jQuery Plugin
   */
  $.fn.gmap3 = function () {
    var items = [];
    gm = window.google.maps; // once gmap3 is loaded, google.maps library should be loaded
    this.each(function () {
      var $this = $(this), gmap3 = $this.data("gmap3");
      if (!gmap3) {
        gmap3 = new Gmap3($this);
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

    foreachStr('map marker rectangle circle then', function (name) {
      self[name] = function () {
        var args = arraySlice.call(arguments);
        items.forEach(function (item) {
          item[name].apply(item, args)
        });
        return self;
      };
    });

    ['on', 'once'].forEach(function (name) {
      self[name] = function () {
        var data = arguments[0];
        if (data) {
          if (typeof data === 'string') { // cast call on('click', handler) to on({click: handler})
            data = {};
            data[arguments[0]] = arraySlice.call(arguments, 1);
          }
          $.each(data, function (eventName, handlers) {
            items.forEach(function (item) {
              item.then(function (instances) {
                if (instances) {
                  (isArray(instances) ? instances : [instances]).forEach(function (instance) {
                    gm.event['addListener' + (name === 'once' ? 'Once' : '')](instance, eventName, function (event) {
                      (isArray(handlers) ? handlers : [handlers]).forEach(function (handler) {
                        if (isFunction(handler)) {
                          handler.call(self, instance, event);
                        }
                      });
                    });
                  });
                }
              });
            });
          });
        }
        return self;
      };
    });

    self.end = function (handler) {
      if (isFunction(handler)) {
        handler.call(self)
      }
      return chain;
    };
  }

  /**
   * Class Gmap3
   * Handle a Google.maps.Map instance
   * @param $container {jQuery} Element to display the map in
   * @constructor
   */
  function Gmap3($container) {
    var map,
      promise = when(),
      self = this;

    function getMap(latLng) {
      // todo: handle defaults
      return map = map || gmElement('Map', $container.get(0), {mapTypeId : gm.MapTypeId.ROADMAP, zoom: 2, center: latLng});
    }

    self.map = function (options) {
      return promise = promise.then(function () {
        return resolveLatLng(options, 'center', function (opts) {
          return map = map || gmElement('Map', $container.get(0), opts);
        })
      });
    };

    /**
     * Decorator to handle multiple call based on array of options
     * @param fn {function(?)}
     * @returns {function}
     */
    function multiple(fn) {
      return function (options) {
        if (isArray(options)) {
          var instances = [];
          var promises = arrayMap(options, function (opts) {
            return fn.call(self, opts).then(function (instance) {
              instances.push(instance);
            });
          });
          return promise = all(promises).then(function () {
            return instances;
          });
        }
        return fn.apply(self, arguments);
      }
    }

    foreachStr('marker:position circle:center', function (item) {
      item = item.split(':');
      self[item[0]] = multiple(function (options) {
        return promise = promise.then(function () {
          return resolveLatLng(options, item[1], function (opts, latLng) {
            opts.map = getMap(latLng);
            return gmElement(ucFirst(item[0]), opts);
          })
        });
      });
    });

    self.rectangle = multiple(function (options) {
      return promise = promise.then(function () {
        return resolveLatLngBounds(options, function (opts, latLng) {
          opts.map = getMap(latLng);
          return gmElement('Rectangle', opts);
        })
      });
    });

    self.then = function (fn) {
      // note: this one is voluntary not chained in the promise to keep all "then" in the same
      // hierarchical level and to not propagate any modifications of the result from the callback
      if (isFunction(fn)) {
        promise.then(function (instance) {
          fn.call(new Handler($container, [self]), instance);
        });
      }
    };
  }

})(jQuery, window);