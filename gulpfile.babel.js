'use strict';
import gulp from 'gulp';
import sass from 'gulp-sass';
import notify from 'gulp-notify';
import minify from 'gulp-minify-css';
import webserver from 'gulp-webserver';
import imagemin from 'gulp-imagemin';
import sourcemaps from 'gulp-sourcemaps';
import zip from 'gulp-zip';
import babelify from 'babelify';
import uglify from 'gulp-uglify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import rimraf from 'gulp-rimraf';

gulp.task('js', function () {
    browserify(['./js/app.js'])
        .transform('babelify', {
        presets: ['es2015', 'es2016', 'es2017']
    })
        .bundle()
        .pipe(source('bundle.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build/'))
        .pipe(notify({message: 'Finished minifying JavaScript'}));
});

gulp.task('imgs', function () {
    gulp
        .src('assets/img/**/*.{png,svg,jpg,gif,bmp,ico,tiff}')
        .pipe(imagemin())
        .pipe(gulp.dest('build/'));
});

gulp.task('html', function () {
    gulp
        .src('views/*.html')
        .pipe(gulp.dest('build/'));
});

gulp.task('sass', function () {
    gulp
        .src('sass/**/*.scss')
        .pipe(sass())
        .pipe(minify())
        .pipe(gulp.dest('build/'));
});

gulp.task('watch', function () {
    gulp.src('build/*')
    .pipe(rimraf());


    gulp.watch('js/**/*.js', ['js']);
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('assets/**/*', ['imgs']);
    gulp.watch(['views/*.html'], ['html']);
});

gulp.task('webserver', function () {
    gulp
        .src('build/')
        .pipe(webserver({livereload: true, open: true}));
});

gulp.task('zip', function () {
    return gulp
        .src('build/*')
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', [
    'watch',
    'html',
    'js',
    'sass',
    'imgs',
    'zip',
    'webserver'
]);
