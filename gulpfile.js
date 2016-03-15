var gulp = require("gulp");
var foreach = require('gulp-foreach');
var replace = require("gulp-replace");
var rename = require("gulp-rename");
var clean = require("gulp-clean");
var runSequence = require("run-sequence");
var uglify = require("gulp-uglify");

/**
 * Remove dist directory
 */
gulp.task("clean", function () {
  return gulp.src("dist", {read: false}).pipe(clean());
});

/**
 * Copy example assets
 */
gulp.task("assets", function () {
  // process each example but the template
  return gulp.src(["src/examples/**/*.png", "src/examples/**/*.css"])
    .pipe(gulp.dest("dist/examples/"));
});

/**
 * Build example files using the template file
 */
gulp.task("examples", ["assets"], function () {
  // process each example but the template
  return gulp.src(["src/examples/**/*.html", "!src/examples/_template.html"])
    .pipe(foreach(function(stream, file){
      return gulp.src("src/examples/_template.html")            // use template file
        .pipe(replace("[body]", file.contents.toString()))      // replace template tag by example content
        .pipe(rename(file.path.split('/').pop()));              // rename template file as example file
    }))
    .pipe(gulp.dest("dist/examples/"));
});

/**
 * Uglify gmap3.js
 */
gulp.task("uglify", function () {
  return gulp.src("dist/gmap3.js")
    .pipe(uglify({preserveComments: "some"}))
    .pipe(rename("gmap3.min.js"))
    .pipe(gulp.dest("dist/"));
});

/**
 * Build gmap3.js
 */
gulp.task("main", function () {
  return gulp.src("src/gmap3.js")
    .pipe(gulp.dest("dist/"));
});

/**
 * Build package
 */
gulp.task("default", function (done) {
  runSequence("clean", "main", "uglify", "examples", done);
});


/**
 * Watch files modifications and rebuild
 **/
gulp.task("watch", function() {
  gulp.start("default");

  gulp.watch("src/**/*", function() {
    gulp.start("default");
  });
});