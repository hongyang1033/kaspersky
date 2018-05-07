"use strict";

//Import all the necessary gulp dependencies
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    htmlreplace = require('gulp-html-replace'),
    cssmin = require('gulp-cssmin');

//Combine all the scripts
gulp.task("concatScripts", function () {
    return gulp.src([
        'assets/js/vendor/jquery-3.2.1.slim.min.js',
        'assets/js/vendor/popper.min.js',
        'assets/js/vendor/bootstrap.min.js',
        'assets/js/functions.js'
    ])
        .pipe(maps.init())
        .pipe(concat('main.js'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest('assets/js'))
        .pipe(browserSync.stream());
});

//Minify all the scripts
gulp.task("minifyScripts", ["concatScripts"], function () {
    return gulp.src("assets/js/main.js")
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest('dist/assets/js'));
});

//Compile SCSS files to CSS
gulp.task('compileSass', function () {
    return gulp.src("assets/css/main.scss")
        .pipe(maps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(maps.write('./'))
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.stream());
});

//Minify CSS Files
gulp.task("minifyCss", ["compileSass"], function () {
    return gulp.src("assets/css/main.css")
        .pipe(cssmin())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('dist/assets/css'));
});

//Watch files for changes
gulp.task('watchFiles', function () {
    gulp.watch('assets/css/**/*.scss', ['compileSass']);
    gulp.watch('assets/js/*.js', ['concatScripts']);
})

//Serve the hot-reload server
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

//Clean the JS and CSS files
gulp.task('clean', function () {
    del(['dist', 'assets/css/main.css*', 'assets/js/main*.js*']);
});

//Rename sources
gulp.task('renameSources', function () {
    return gulp.src(['*.html', '*.php'])
        .pipe(htmlreplace({
            'js': 'assets/js/main.min.js',
            'css': 'assets/css/main.min.css'
        }))
        .pipe(gulp.dest('dist/'));
});

//Build all the production ready codes
gulp.task("build", ['minifyScripts', 'minifyCss'], function () {
    return gulp.src(['*.html', '*.php', 'favicon.ico',
        "assets/img/**", "assets/fonts/**"], { base: './' })
        .pipe(gulp.dest('dist'));
});

//Serve the hot-reload server and watching the files for changes
gulp.task('serve', ['watchFiles'], function () {
    browserSync.init({
        server: "./"
    });

    gulp.watch("assets/css/**/*.scss", ['watchFiles']);
    gulp.watch(['*.html', '*.php']).on('change', browserSync.reload);
});

//Clean the sources
gulp.task("default", ["clean", 'build'], function () {
    gulp.start('renameSources');
});
