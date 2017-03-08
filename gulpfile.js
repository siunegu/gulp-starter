const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify');
const minify = require('gulp-minify-css');
const webserver = require('gulp-webserver');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const zip = require('gulp-zip');
const babelify = require('babelify');
const browserify = require('browserify'); 
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

gulp.task('js', function () {
    gulp.src(['js/**/*.js'])
      browserify(['./js/app.js'])
      .transform('babelify', {
        presets: ['es2015', 'es2016', 'es2017']
      })
      .bundle()    
      .pipe(source('bundle.min.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('app/public/build/js/'))
      .pipe(notify({
          message: 'Finished minifying JavaScript'
      }));        
});

gulp.task('imgs', function() {
    gulp.src('assets/img/**/*.{png,svg,jpg,gif,bmp,ico,tiff}')
        .pipe(imagemin())
        .pipe(gulp.dest('build/'))
})

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
   .pipe(zip('dist.zip'))
   .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch', 'html', 'js', 'sass', 'imgs', 'zip', 'webserver']);
