var gulp = require("gulp"),
  concat = require("gulp-concat"),
  clean = require("gulp-clean"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  replace = require("gulp-replace"),
  runSequence = require("run-sequence"),
  jqc = require("gulp-jquery-closure"),
  streamqueue = require('streamqueue'),
  mustache = require("gulp-mustache-plus"),
  zip = require("gulp-zip"),
  md5 = require("MD5"),
  path = require("path"),

  gulpOptions = require("./gulp-options.js"),
  options = gulpOptions.options(),
  pjson = require('./package.json');

options.version = pjson.version;
options.date = pjson.date;

gulp.task("clean", function () {
  return gulp.src("dist", {read: false}).pipe(clean());
});

gulp.task("cleanTmp", function () {
  return gulp.src("tmp", {read: false}).pipe(clean());
});

// build copyright
gulp.task("copyright", function () {
  return gulp.src("src/copyright.js")
    .pipe(mustache(options, {extension: ".js"}))
    .pipe(gulp.dest("./tmp"));
});

// Build tools
gulp.task("tools", function () {
  return gulp.src("src/tools.mustache")
    .pipe(mustache(options, {extension: ".js", file_prepend: "\n"}, gulpOptions.partials()))
    .pipe(gulp.dest("./tmp"));
});

// Build GMAP3 class
gulp.task("gmap3", function () {
  return gulp.src("src/gmap3.js")
    .pipe(mustache(options, {extension: ".js", file_prepend: "\n"}))
    .pipe(gulp.dest("./tmp"));
});

// Build full gmap3 plugin
gulp.task("dist", ["copyright", "tools", "gmap3"], function () {
  var stream = streamqueue({ objectMode: true });
  stream.queue(gulp.src(["tmp/copyright.js"]));
  stream.queue(
      gulp.src(["tmp/tools.js", "tmp/gmap3.js", "src/core.js"])
      .pipe(concat("gmap3.js"))
        .pipe(replace(/(\r\n|\n|\r) *\/\/ *(\r\n|\n|\r)/g, "$1")) // remove the standalone // due to mustache parameters in comments
        .pipe(jqc({undefined: "undef"}))
  );
  return stream.done()
    .pipe(concat("gmap3.js"))
    .pipe(gulp.dest("dist/"));
});

// Uglify gmap3.js
gulp.task("uglify", function () {
  return gulp.src("dist/gmap3.js")
    .pipe(uglify({preserveComments: "some"}))
    .pipe(rename("gmap3.min.js"))
    .pipe(gulp.dest("dist/"));
});

// Append HTML demo and examples into dist
gulp.task("html", function () {
  return gulp.src(gulpOptions.assets(), {base: "assets/"})
    .pipe(gulp.dest("dist/"));
});

gulp.task("zip", function () {
  var filename = "gmap3-" +
    options.version +
    (options.build_cmd ? "-" + md5(options.build_cmd) : "") +
    ".zip";
  return gulp.src("dist/**/*")
    .pipe(zip(filename))
    .pipe(gulp.dest("dist/"));
});

// default task
gulp.task("default", function (callback) {
  runSequence("clean", "dist", "uglify", "cleanTmp", callback);
});

// build package including demo and examples
gulp.task("package", function (callback) {
  runSequence("clean", "dist", "uglify", "html", "zip", "cleanTmp", callback);
});

// extract build_cmd removing task name
options.build_cmd = (function () {
  var head = 2,
    result = "";
  if (process.argv.length > 2) {
    if (gulp.hasTask(process.argv[2])) {
      head++;
    }
    result = process.argv.length > head ? "Build options : " + process.argv.slice(head).join(" ") + "\n" : "";
  }
  return result;
}());