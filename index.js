'use strict';

const path          = require('path');
const _             = require('underscore');
const consolidate   = require('gulp-consolidate');
const gulp          = require('gulp');
const iconfont      = require('gulp-iconfont');
const merge         = require('merge-stream');
const onFinished    = require('finished');
const insert        = require('gulp-insert');
const defaultConfig = require('./config');

function generateFont(cb, customConfig) {
    let config = _.extend(_.clone(defaultConfig), customConfig);
    let paths = {};

    ['Svg', 'Fonts', 'Scss', 'HtmlSpecimen'].forEach(function(key) {
        paths['src' + key] = path.join(config.pathSrcBase, config['pathSrc' + key] || '');
        paths['dest' + key] = path.join(config.pathDestBase, config['pathDest' + key] || '');
    });

    function buildTemplates(glyphs) {
        let templateData = _.extend({
                glyphs: glyphs,
        }, config);

        let scssStream = gulp.src(paths.srcScss)
            .pipe(consolidate('underscore', templateData))
            .pipe(insert.prepend(`//${config.generatedWarning}\n`))
            .pipe(gulp.dest(paths.destScss));

        let allStreams = merge(scssStream);

        if (config.pathDestHtmlSpecimen) {
            let htmlStream = gulp.src(paths.srcHtmlSpecimen)
                .pipe(consolidate('underscore', templateData))
                .pipe(insert.prepend(`<!--${config.generatedWarning}-->\n`))
                .pipe(gulp.dest(paths.destHtmlSpecimen));
            allStreams.add(htmlStream);
        }

        onFinished(allStreams, function(err) {
            cb(err);
        });
    }

    gulp.src([paths.srcSvg])
        .pipe(iconfont({
            fontName     : config.fontFaceName,
            appendUnicode: false,
            normalize    : true,
        }))
        .on('glyphs', buildTemplates)
        .pipe(gulp.dest(paths.destFonts));
}

module.exports = generateFont;

