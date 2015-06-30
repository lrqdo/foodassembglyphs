'use strict';

const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const consolidate = require('gulp-consolidate');
const onFinished = require('finished');
const merge = require('merge-stream');
const sass = require('gulp-sass');

const config = {
    fontFaceName: 'testfont',
};

gulp.task('font', function generateFont(cb) {
    function buildTemplates(glyphs) {
        let templateData = {
                glyphs  : glyphs,
                fontName: config.fontFaceName,
                fontPath: '../fonts/',
            };

        let scssStream = gulp.src('templates/foodAssembGlyphs.scss')
            .pipe(consolidate('underscore', templateData))
            .pipe(gulp.dest('build/sass'));
            // .on('complete', function() { cb(); console.log('youpi');});

        let htmlStream = gulp.src('templates/specimen.html')
            .pipe(consolidate('underscore', templateData))
            .pipe(gulp.dest('build/specimen'));

        onFinished(merge(scssStream, htmlStream), function(err) {
            if (!err) {
                cb();
            }
        });
    }

    gulp.src(['svg/*.svg'])
        .pipe(iconfont({
            fontName     : config.fontFaceName,
            appendUnicode: true,
        }))
        .on('glyphs', buildTemplates)
        .pipe(gulp.dest('build/fonts/'));
});

gulp.task('css', ['font'], function() {
    gulp.src('build/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/css'));
});

gulp.task('default', ['font', 'css'], function() {
    console.log('finished');
});
