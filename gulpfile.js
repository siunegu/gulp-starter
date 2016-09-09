var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify');
    minify = require('gulp-minify-css'),
    webserver = require('gulp-webserver'),
    zip = require('gulp-zip');

gulp.task('vendor-js', function () {
  gulp.src([
        'node_modules/bluebird/browser/bluebird.min.js',
        'node_modules/jquery/dist/jquery.slim.min.js'
      ])
      .pipe(concat('vendor.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('build/'))
      .pipe(notify({
          message: 'Finished minifying vendor scripts'
      }));
});

gulp.task('vendor-css', function () {
  gulp.src([
        'node_modules/bootstrap/scss/**/*.scss'
      ])
      .pipe(sass())
      .pipe(minify())
      .pipe(concat('vendor.css'))
      .pipe(gulp.dest('build/'))
      .pipe(notify({
          message: 'Finished minifying vendor styles'
      }));
});

gulp.task('js', function () {

    gulp.src(['js/**/*.js'])
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/'))
        .pipe(notify({
            message: 'Finished minifying JavaScript'
        }));
});

gulp.task('html', function () {
    gulp.src('views/*.html')
        .pipe(gulp.dest('build/'));
});

gulp.task('sass', function () {
    gulp.src('sass/**/*.scss')
        .pipe(sass())
        .pipe(minify())
        .pipe(gulp.dest('build/'));
});

gulp.task('watch', function () {
    gulp.watch('js/**/*', ['js']);
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch(['views/*.html'], ['html']);
});

gulp.task('webserver', function () {
    gulp.src('build/')
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});

gulp.task('zip', function() {
 return gulp.src('build/*')
   .pipe(zip('gulp_starter.zip'))
   .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch', 'html', 'vendor-css', 'vendor-js', 'js', 'sass', 'zip', 'webserver']);
