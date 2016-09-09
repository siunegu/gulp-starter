var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify');
    minify = require('gulp-minify-css'),
    webserver = require('gulp-webserver'),
    zip = require('gulp-zip');

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
   .pipe(zip('Asana_projects.zip'))
   .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch', 'html', 'js', 'sass', 'zip', 'webserver']);
