var features = ["overlay", "cluster", "marker", "getroute", "getdistance", "infowindow", "circle", "getaddress",
    "getlatlng", "getmaxzoom", "getelevation", "defaults", "rectangle", "polyline", "polygon", "trafficlayer",
    "bicyclinglayer", "groundoverlay", "streetviewpanorama", "kmllayer", "panel", "directionsrenderer", "getgeoloc",
    "styledmaptype", "imagemaptype", "autofit", "clear", "get", "exec", "trigger", "destroy"],

  dependencies = {
    cluster: ["overlay", "marker"],
    polyline: ["poly"],
    polygon: ["poly"]
  };

var argv = require("yargs").argv,
  fs = require("fs"),
  path = require("path");

/**
 * Return false if option is set to false (default = true)
 * @param name {string}
 * @returns {boolean}
 */
function option(name) {
  return argv[name] !== false;
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
  var i, name, result = [];
  if (dependencies[current]) {
    for (i = 0; i < dependencies[current].length; i++) {
      name = dependencies[current][i];
      result.push(name);
      if (dependencies[name]) { // dependency has dependencies
        Array.prototype.push.apply(result, getDependecies(name));
      }
    }
  }
  return result;
}

/**
 * Return options
 * @return {object} optionName => boolean
 */
exports.options = function () {
  var i, j, name, deps,
    result = [];
  for (i = 0; i < features.length; i++) {
    name = features[i];
    if (!result[name]) { // may already be done by dependencies
      result[name] = option(name);
      if (result[name]) {
        deps = getDependecies(name);
        for (j = 0; j < deps.length; j++) {
          result[deps[j]] = true;
        }
      }
    }
  }
  return result;
};

/**
 * return partials
 * @return {object} partialName => partialFilePath
 */
exports.partials = function () {
  var i, basename, p,
    result = {},
    files = walk("src/tools");
  for (i = 0; i < files.length; i++) {
    p = files[i];
    if (p !== "." && p !== "..") {
      basename = path.basename(p).replace(/\..*/, "");
      result[basename] = p;
    }
  }
  return result;
};