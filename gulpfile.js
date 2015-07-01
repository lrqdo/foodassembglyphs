'use strict';

const _ = require('underscore');
const consolidate = require('gulp-consolidate');
const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const merge = require('merge-stream');
const onFinished = require('finished');
const sass = require('gulp-sass');

const config = {
    fontFaceName: 'foodassembglyphs',
    fontPath    : '../fonts/',
    iconPrefix  : 'icontest',
};

gulp.task('font', function generateFont(cb) {
    function buildTemplates(glyphs) {
        let templateData = _.extend({
                glyphs: glyphs,
        }, config);

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
            normalize    : true,
        }))
        .on('glyphs', buildTemplates)
        .pipe(gulp.dest('build/fonts/'));
});

gulp.task('css', ['font'], function() {
    gulp.src('build/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/specimen'));
});

gulp.task('default', ['font', 'css'], function() {
    console.log('finished');
});
