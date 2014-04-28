var features = ["autofit", "bicyclinglayer", "circle", "clear", "cluster", "defaults", "destroy", "directionsrenderer",
    "exec", "get", "getaddress", "getdistance", "getelevation", "getgeoloc", "getlatlng", "getmaxzoom", "getroute",
    "groundoverlay", "imagemaptype", "infowindow", "kmllayer", "marker", "overlay", "panel", "polygon", "polyline", "rectangle",
    "streetviewpanorama", "styledmaptype", "trafficlayer", "trigger"],

  dependencies = {
    cluster: ["overlay", "marker"],
    polyline: ["poly"],
    polygon: ["poly"]
  },

  examples = {
    autocomplete: ["getaddress", "clear", "marker"],
    "cluster calculator": ["clear", "marker", "cluster"],
    clusters: ["clear", "marker", "cluster", "get", "overlay"],
    "context-menu": ["clear", "marker", "getroute", "get", "directionsrenderer"],
    ebrosur: ["marker", "cluster", "get"]
  },

  demos = {
    address: ["marker", "getaddress", "infowindow"],
    autofit: ["circle", "autofit"],
    circle: ["circle"],
    clear: ["circle", "marker", "cluster", "circle", "rectangle", "polyline", "polygon"],
    "cluster - add real marker": ["marker", "cluster", "get"],
    "cluster - filter": ["marker", "cluster", "get"],
    "cluster - remove a marker": ["marker", "cluster", "clear"],
    cluster: ["marker", "cluster"],
    control: [],
    "control-advanced": ["exec", "marker", "circle", "rectangle"],
    debug: ["defaults"],
    distance: ["getdistance"],
    elevation: ["getelevation", "marker", "infowindow"],
    "elevation-path": ["getelevation", "marker", "getelevation"],
    "Fusion Tables": ["bikeLayer", "trafficlayer"],
    geoloc: ["getgeoloc", "marker"],
    groundoverlay: ["groundoverlay"],
    ids: ["marker", "get"],
    imagemaptype: ["imagemaptype", "get"],
    infowindow: ["infowindow"],
    "kml - tag": ["kmllayer", "get"],
    kml: ["kmllayer", "get"],
    latlng: ["getlatlng", "marker"],
    "map-options": [],
    marker: ["marker"],
    markers: ["marker"],
    markerWithLabel: ["marker"],
    maxzoom: ["getmaxzoom"],
    overlay: ["marker", "overlay", "get"],
    panel: ["panel"],
    polygon: ["polygon", "infowindow"],
    polyline: ["polyline"],
    rectangle: ["rectangle"],
    rightclick: ["marker"],
    selector: ["marker"],
    streetviewpanorama: ["marker", "infowindow"],
    tags: ["get", "marker", "clear"],
    trigger: ["trigger"]
  };

var argv = require("yargs").argv,
  fs = require("fs"),
  path = require("path"),
  revert = !!argv.only;

/**
 * Return CLI value or default value
 * @param name {string}
 * @returns {boolean}
 */
function testOption(name, def) {
  return name in argv ? Boolean(argv[name]) : def;
}

/**
 * Return options list depending on CLI arguments
 * @return {object} optionName => boolean
 */
function getOptions() {
  var result = [];
  features.forEach(function (name) {
    if (!result[name]) { // may already be done by dependencies
      result[name] = testOption(name, !revert);
      if (result[name]) {
        getDependecies(name).forEach(function (dependency) {
          result[dependency] = true;
        });
      }
    }
  });
  return result;
}

/**
 * List recursively a path and return all files
 * @param dir {string}
 * @returns {Array}
 */
function walk(dir) {
  var stat,
    results = [],
    list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = dir + "/" + file;
    stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

/**
 * return file dependencies based on global dependencies
 * @param current {string}
 * @returns {Array}
 */
function getDependecies(current) {
  var result = [];
  if (dependencies[current]) {
    dependencies[current].forEach(function (name) {
      result.push(name);
      if (dependencies[name]) { // dependency has dependencies
        result = result.concat(result, getDependecies(name));
      }
    });
  }
  return result;
}

exports.options = getOptions;

/**
 * return partials
 * @return {object} partialName => partialFilePath
 */
exports.partials = function () {
  var basename,
    result = {},
    files = walk("src/tools");
  files.forEach(function (p) {
    if (p !== "." && p !== "..") {
      basename = path.basename(p).replace(/\..*/, "");
      result[basename] = p;
    }
  });
  return result;
};

/**
 * return demo files depending on CLI arguments
 * @return {Array}
 */
exports.assets = function () {
  var filename, required,
    result = [],
    options = getOptions();

  /**
   * Return True if all options required are satisfied
   * @param required {Array}
   * @returns {boolean}
   */
  function valid(required) {
    var result = true;
    required.forEach(function (option) {
      result = result && options[option];
      return result;
    });
    return result;
  }

  // add demo
  for (filename in demos) {
    if (valid(demos[filename])) {
      result.push("assets/demo/" + filename + ".html");
    }
  }
  // specifics demo assets
  if (options.cluster) {
    result.push("assets/demo/images/*");
  }
  if (options.marker) {
    result.push("assets/demo/external/*");
  }
  // add examples
  for (filename in examples) {
    if (valid(examples[filename])) {
      result.push("assets/examples/" + filename + "/**/*");
    }
  }
  return result;
};