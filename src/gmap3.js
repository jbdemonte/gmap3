(function ($, window) {
  var gm, services = {},

    // Proxify functions to get shorter minified code
    arraySlice = Array.prototype.slice,
    when = $.when,
    extend = $.extend,
    isArray = $.isArray,
    isFunction = $.isFunction,
    deferred = $.Deferred;

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
    return resolved(fn(options, bounds ? options.bounds.getCenter() : null));
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
      return isArray(item) ? gmElement('LatLng', item[0], item[1]) : item;
    });
    return resolved(fn(options, options[key][0]));
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

    foreachStr('map marker rectangle circle infowindow polyline then resume', function (name) {
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
      resume = [],
      promise = when(),
      self = this;

    function getMap(latLng, opts) {
      if (!map) {
        map = gmElement('Map', $container.get(0), opts ||{mapTypeId : gm.MapTypeId.ROADMAP, zoom: 2, center: latLng});
        resume.push(map);
      }
      return map;
    }

    self.map = function (options) {
      return promise = promise.then(function () {
        return resolveLatLng(options, 'center', function (opts, latLng) {
          return getMap(latLng, opts);
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
          var promises = options.map(function (opts) {
            return fn.call(self, opts).then(function (instance) {
              instances.push(instance);
            });
          });
          return promise = all(promises).then(function () {
            resume.push(instances);
            return instances;
          });
        }
        return fn.apply(self, arguments).then(function (instance) {
          resume.push(instance);
          return instance;
        });
      }
    }

    // Space separated string of : separated element
    // (google.maps class name) : (latLng property name) : (add map - 0|1 - default = 1)
    foreachStr('Marker:position Circle:center InfoWindow:position:0 Polyline:path', function (item) {
      item = item.split(':');
      var property = item[1];
      self[item[0].toLowerCase()] = multiple(function (options) {
        return promise = promise.then(function () {
          return (property.match(/^path/) ? resolveArrayOfLatLng : resolveLatLng)(options, property, function (opts, latLng) {
            if (item[2] !== '0') {
              opts.map = getMap(latLng);
            }
            return gmElement(item[0], opts);
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

    self.resume = function (fn) {
      // note: this one is voluntary not chained in the promise to keep all "then" in the same
      // hierarchical level and to not propagate any modifications of the result from the callback
      if (isFunction(fn)) {
        promise.then(function () {
          // copy arrays to no accept modifications on the internal array
          var copy = resume.map(function (instance) {
            return isArray(instance) ? instance.slice() : instance;
          });
          fn.apply(new Handler($container, [self]), copy);
        });
      }
    };
  }

})(jQuery, window);