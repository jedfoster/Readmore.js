var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('compress', function() {
  gulp.src('readmore.js')
    .pipe(uglify({
      mangle: true,
      compress: true,
      preserveComments: 'some'
    }))
    .pipe(rename('readmore.min.js'))
    .pipe(gulp.dest('./'));
});
