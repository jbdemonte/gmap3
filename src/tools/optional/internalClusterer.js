
/**
 * Class InternalClusterer
 * This class manage clusters thanks to "td" objects
 *
 * Note:
 * Individuals marker are created on the fly thanks to the td objects, they are
 * first set to null to keep the indexes synchronised with the td list
 * This is the "display" function, set by the gmap3 object, which uses theses data
 * to create markers when clusters are not required
 * To remove a marker, the objects are deleted and set not null in arrays
 *    markers[key]
 *      = null : marker exist but has not been displayed yet
 *      = false : marker has been removed
 **/
function InternalClusterer($container, map, raw) {
  var timer, projection,
    ffilter, fdisplay, ferror, // callback function
    updating = false,
    updated = false,
    redrawing = false,
    ready = false,
    enabled = true,
    self = this,
    events =  [],
    store = {},   // combin of index (id1-id2-...) => object
    ids = {},     // unique id => index
    idxs = {},    // index => unique id
    markers = [], // index => marker
    tds = [],   // index => td or null if removed
    values = [],  // index => value
    overlay = newEmptyOverlay(map, raw.radius);

  main();

  function prepareMarker(index) {
    if (!markers[index]) {
      delete tds[index].options.map;
      markers[index] = new defaults.classes.Marker(tds[index].options);
      attachEvents($container, {td: tds[index]}, markers[index], tds[index].id);
    }
  }

  /**
   * return a marker by its id, null if not yet displayed and false if no exist or removed
   **/
  self.getById = function (id) {
    if (id in ids) {
      prepareMarker(ids[id]);
      return  markers[ids[id]];
    }
    return false;
  };

  /**
   * remove one object from the store
   **/
  self.rm = function (id) {
    var index = ids[id];
    if (markers[index]) { // can be null
      markers[index].setMap(null);
    }
    delete markers[index];
    markers[index] = false;

    delete tds[index];
    tds[index] = false;

    delete values[index];
    values[index] = false;

    delete ids[id];
    delete idxs[index];
    updated = true;
  };

  /**
   * remove a marker by its id
   **/
  self.clearById = function (id) {
    if (id in ids){
      self.rm(id);
      return true;
    }
  };

  /**
   * remove objects from the store
   **/
  self.clear = function (last, first, tag) {
    var start, stop, step, index, i,
      list = [],
      check = ftag(tag);
    if (last) {
      start = tds.length - 1;
      stop = -1;
      step = -1;
    } else {
      start = 0;
      stop =  tds.length;
      step = 1;
    }
    for (index = start; index !== stop; index += step) {
      if (tds[index]) {
        if (!check || check(tds[index].tag)) {
          list.push(idxs[index]);
          if (first || last) {
            break;
          }
        }
      }
    }
    for (i = 0; i < list.length; i++) {
      self.rm(list[i]);
    }
  };

  // add a "marker td" to the cluster
  self.add = function (td, value) {
    td.id = globalId(td.id);
    self.clearById(td.id);
    ids[td.id] = markers.length;
    idxs[markers.length] = td.id;
    markers.push(null); // null = marker not yet created / displayed
    tds.push(td);
    values.push(value);
    updated = true;
  };

  // add a real marker to the cluster
  self.addMarker = function (marker, td) {
    td = td || {};
    td.id = globalId(td.id);
    self.clearById(td.id);
    if (!td.options) {
      td.options = {};
    }
    td.options.position = marker.getPosition();
    attachEvents($container, {td: td}, marker, td.id);
    ids[td.id] = markers.length;
    idxs[markers.length] = td.id;
    markers.push(marker);
    tds.push(td);
    values.push(td.data || {});
    updated = true;
  };

  // return a "marker td" by its index
  self.td = function (index) {
    return tds[index];
  };

  // return a "marker value" by its index
  self.value = function (index) {
    return values[index];
  };

  // return a marker by its index
  self.marker = function (index) {
    if (index in markers) {
      prepareMarker(index);
      return  markers[index];
    }
    return false;
  };

  // return a marker by its index
  self.markerIsSet = function (index) {
    return Boolean(markers[index]);
  };

  // store a new marker instead if the default "false"
  self.setMarker = function (index, marker) {
    markers[index] = marker;
  };

  // link the visible overlay to the logical data (to hide overlays later)
  self.store = function (cluster, obj, shadow) {
    store[cluster.ref] = {obj: obj, shadow: shadow};
  };

  // free all objects
  self.free = function () {
    var i;
    for(i = 0; i < events.length; i++) {
      gm.event.removeListener(events[i]);
    }
    events = [];

    $.each(store, function (key) {
      flush(key);
    });
    store = {};

    $.each(tds, function (i) {
      tds[i] = null;
    });
    tds = [];

    $.each(markers, function (i) {
      if (markers[i]) { // false = removed
        markers[i].setMap(null);
        delete markers[i];
      }
    });
    markers = [];

    $.each(values, function (i) {
      delete values[i];
    });
    values = [];

    ids = {};
    idxs = {};
  };

  // link the display function
  self.filter = function (f) {
    ffilter = f;
    redraw();
  };

  // enable/disable the clustering feature
  self.enable = function (value) {
    if (enabled !== value) {
      enabled = value;
      redraw();
    }
  };

  // link the display function
  self.display = function (f) {
    fdisplay = f;
  };

  // link the errorfunction
  self.error = function (f) {
    ferror = f;
  };

  // lock the redraw
  self.beginUpdate = function () {
    updating = true;
  };

  // unlock the redraw
  self.endUpdate = function () {
    updating = false;
    if (updated) {
      redraw();
    }
  };

  // extends current bounds with internal markers
  self.autofit = function (bounds) {
    var i;
    for (i = 0; i < tds.length; i++) {
      if (tds[i]) {
        bounds.extend(tds[i].options.position);
      }
    }
  };

  // bind events
  function main() {
    projection = overlay.getProjection();
    if (!projection) {
      setTimeout(function () { main.apply(self, []); }, 25);
      return;
    }
    ready = true;
    events.push(gm.event.addListener(map, "zoom_changed", delayRedraw));
    events.push(gm.event.addListener(map, "bounds_changed", delayRedraw));
    redraw();
  }

  // flush overlays
  function flush(key) {
    if (isObject(store[key])) { // is overlay
      if (isFunction(store[key].obj.setMap)) {
        store[key].obj.setMap(null);
      }
      if (isFunction(store[key].obj.remove)) {
        store[key].obj.remove();
      }
      if (isFunction(store[key].shadow.remove)) {
        store[key].obj.remove();
      }
      if (isFunction(store[key].shadow.setMap)) {
        store[key].shadow.setMap(null);
      }
      delete store[key].obj;
      delete store[key].shadow;
    } else if (markers[key]) { // marker not removed
      markers[key].setMap(null);
      // don't remove the marker object, it may be displayed later
    }
    delete store[key];
  }

  /**
   * return the distance between 2 latLng couple into meters
   * Params :
   *  Lat1, Lng1, Lat2, Lng2
   *  LatLng1, Lat2, Lng2
   *  Lat1, Lng1, LatLng2
   *  LatLng1, LatLng2
   **/
  function distanceInMeter() {
    var lat1, lat2, lng1, lng2, e, f, g, h,
      cos = Math.cos,
      sin = Math.sin,
      args = arguments;
    if (args[0] instanceof gm.LatLng) {
      lat1 = args[0].lat();
      lng1 = args[0].lng();
      if (args[1] instanceof gm.LatLng) {
        lat2 = args[1].lat();
        lng2 = args[1].lng();
      } else {
        lat2 = args[1];
        lng2 = args[2];
      }
    } else {
      lat1 = args[0];
      lng1 = args[1];
      if (args[2] instanceof gm.LatLng) {
        lat2 = args[2].lat();
        lng2 = args[2].lng();
      } else {
        lat2 = args[2];
        lng2 = args[3];
      }
    }
    e = Math.PI * lat1 / 180;
    f = Math.PI * lng1 / 180;
    g = Math.PI * lat2 / 180;
    h = Math.PI * lng2 / 180;
    return 1000 * 6371 * Math.acos(Math.min(cos(e) * cos(g) * cos(f) * cos(h) + cos(e) * sin(f) * cos(g) * sin(h) + sin(e) * sin(g), 1));
  }

  // extend the visible bounds
  function extendsMapBounds() {
    var radius = distanceInMeter(map.getCenter(), map.getBounds().getNorthEast()),
      circle = new gm.Circle({
        center: map.getCenter(),
        radius: 1.25 * radius // + 25%
      });
    return circle.getBounds();
  }

  // return an object where keys are store keys
  function getStoreKeys() {
    var k,
      keys = {};
    for (k in store) {
      keys[k] = true;
    }
    return keys;
  }

  // async the delay function
  function delayRedraw() {
    clearTimeout(timer);
    timer = setTimeout(redraw, 25);
  }

  // generate bounds extended by radius
  function extendsBounds(latLng) {
    var p = projection.fromLatLngToDivPixel(latLng),
      ne = projection.fromDivPixelToLatLng(new gm.Point(p.x + raw.radius, p.y - raw.radius)),
      sw = projection.fromDivPixelToLatLng(new gm.Point(p.x - raw.radius, p.y + raw.radius));
    return new gm.LatLngBounds(sw, ne);
  }

  // run the clustering process and call the display function
  function redraw() {
    if (updating || redrawing || !ready) {
      return;
    }

    var i, j, k, indexes, check = false, bounds, cluster, position, previous, lat, lng, loop,
      keys = [],
      used = {},
      zoom = map.getZoom(),
      forceDisabled = ("maxZoom" in raw) && (zoom > raw.maxZoom),
      previousKeys = getStoreKeys();

    // reset flag
    updated = false;

    if (zoom > 3) {
      // extend the bounds of the visible map to manage clusters near the boundaries
      bounds = extendsMapBounds();

      // check contain only if boundaries are valid
      check = bounds.getSouthWest().lng() < bounds.getNorthEast().lng();
    }

    // calculate positions of "visibles" markers (in extended bounds)
    for (i = 0; i < tds.length; i++) {
      if (tds[i] && (!check || bounds.contains(tds[i].options.position)) && (!ffilter || ffilter(values[i]))) {
        keys.push(i);
      }
    }

    // for each "visible" marker, search its neighbors to create a cluster
    // we can't do a classical "for" loop, because, analysis can bypass a marker while focusing on cluster
    while (1) {
      i = 0;
      while (used[i] && (i < keys.length)) { // look for the next marker not used
        i++;
      }
      if (i === keys.length) {
        break;
      }

      indexes = [];

      if (enabled && !forceDisabled) {
        loop = 10;
        do {
          previous = indexes;
          indexes = [];
          loop--;

          if (previous.length) {
            position = bounds.getCenter();
          } else {
            position = tds[keys[i]].options.position;
          }
          bounds = extendsBounds(position);

          for (j = i; j < keys.length; j++) {
            if (used[j]) {
              continue;
            }
            if (bounds.contains(tds[keys[j]].options.position)) {
              indexes.push(j);
            }
          }
        } while ((previous.length < indexes.length) && (indexes.length > 1) && loop);
      } else {
        for (j = i; j < keys.length; j++) {
          if (!used[j]) {
            indexes.push(j);
            break;
          }
        }
      }

      cluster = {indexes: [], ref: []};
      lat = lng = 0;
      for (k = 0; k < indexes.length; k++) {
        used[indexes[k]] = true;
        cluster.indexes.push(keys[indexes[k]]);
        cluster.ref.push(keys[indexes[k]]);
        lat += tds[keys[indexes[k]]].options.position.lat();
        lng += tds[keys[indexes[k]]].options.position.lng();
      }
      lat /= indexes.length;
      lng /= indexes.length;
      cluster.latLng = new gm.LatLng(lat, lng);

      cluster.ref = cluster.ref.join("-");

      if (cluster.ref in previousKeys) { // cluster doesn't change
        delete previousKeys[cluster.ref]; // remove this entry, these still in this array will be removed
      } else { // cluster is new
        if (indexes.length === 1) { // alone markers are not stored, so need to keep the key (else, will be displayed every time and marker will blink)
          store[cluster.ref] = true;
        }
        fdisplay(cluster);
      }
    }

    // flush the previous overlays which are not still used
    $.each(previousKeys, function (key) {
      flush(key);
    });
    redrawing = false;
  }
}