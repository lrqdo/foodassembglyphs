'use strict';

const _ = require('underscore');
const consolidate = require('gulp-consolidate');
const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const merge = require('merge-stream');
const onFinished = require('finished');
const insert = require('gulp-insert');
const config = require('./config');

function generateFont(cb) {
    function buildTemplates(glyphs) {
        let templateData = _.extend({
                glyphs: glyphs,
        }, config);

        let scssStream = gulp.src('templates/*.scss')
            .pipe(consolidate('underscore', templateData))
            .pipe(insert.prepend(`//${config.generatedWarning}\n`))
            .pipe(gulp.dest('build/sass'));

        let htmlStream = gulp.src('templates/specimen.html')
            .pipe(consolidate('underscore', templateData))
            .pipe(insert.prepend(`<!--${config.generatedWarning}-->\n`))
            .pipe(gulp.dest('build/specimen'));

        onFinished(merge(scssStream, htmlStream), function(err) {
            if (!err) {
                cb();
            }
        });
    }

    // FIXME: when used as a node_modules, working dir is the one of the parent module
    // this forces the parent gulp task to chdir again :/
    process.chdir(__dirname);

    gulp.src(['svg/*.svg'])
        .pipe(iconfont({
            fontName     : config.fontFaceName,
            appendUnicode: false,
            normalize    : true,
        }))
        .on('glyphs', buildTemplates)
        .pipe(gulp.dest('build/fonts/'));
}

module.exports = generateFont;

