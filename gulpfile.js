var gulp = require('gulp'),
  stylus = require('gulp-stylus');

gulp.task('default', ['stylus']);


gulp.task('stylus', function () {
  gulp.src('./stylesheets/*.styl')
    .pipe(stylus({
      'include css': true
    }))
    .pipe(gulp.dest('./stylesheets/'));
});

gulp.task('watch', function () {
  gulp.start("stylus");
  gulp.watch("./stylesheets/**/*.styl", ["stylus"]);
});
