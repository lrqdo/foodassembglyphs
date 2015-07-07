'use strict';

const path        = require('path');
const _           = require('underscore');
const consolidate = require('gulp-consolidate');
const gulp        = require('gulp');
const iconfont    = require('gulp-iconfont');
const merge       = require('merge-stream');
const onFinished  = require('finished');
const insert      = require('gulp-insert');
const config      = require('./config');

function generateFont(cb) {
    let paths = _.clone(config.taskPaths);

    Object.keys(paths).forEach(function(key) {
        paths[key] = path.join(__dirname, paths[key]);
    });

    function buildTemplates(glyphs) {
        let templateData = _.extend({
                glyphs: glyphs,
        }, config);

        let scssStream = gulp.src(paths.scssTpl)
            .pipe(consolidate('underscore', templateData))
            .pipe(insert.prepend(`//${config.generatedWarning}\n`))
            .pipe(gulp.dest(paths.scssBuild));

        let htmlStream = gulp.src(paths.htmlTpl)
            .pipe(consolidate('underscore', templateData))
            .pipe(insert.prepend(`<!--${config.generatedWarning}-->\n`))
            .pipe(gulp.dest(paths.htmlBuild));

        onFinished(merge(scssStream, htmlStream), function(err) {
            cb(err, config);
        });
    }

    gulp.src([paths.svg])
        .pipe(iconfont({
            fontName     : config.fontFaceName,
            appendUnicode: false,
            normalize    : true,
        }))
        .on('glyphs', buildTemplates)
        .pipe(gulp.dest(paths.fonts));
}

module.exports = generateFont;

