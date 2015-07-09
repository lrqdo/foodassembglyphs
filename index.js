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
    // let paths = _.clone(config.taskPaths);

    // Object.keys(paths).forEach(function(key) {
    //     paths[key] = path.join(__dirname, paths[key]);
    // });
    let config = _.extend( _.clone(defaultConfig), customConfig);

    ['Svg', 'Fonts', 'Scss', 'HtmlSpecimen'].forEach(function(key) {
        config['pathSrc' + key] = path.join(config.pathSrcBase, config['pathSrc' + key] || '');
        config['pathDest' + key] = path.join(config.pathDestBase, config['pathDest' + key] || '');
    });

    function buildTemplates(glyphs) {
        let templateData = _.extend({
                glyphs: glyphs,
        }, config);

        let scssStream = gulp.src(config.pathSrcScss)
            .pipe(consolidate('underscore', templateData))
            .pipe(insert.prepend(`//${config.generatedWarning}\n`))
            .pipe(gulp.dest(config.pathDestScss));

        let htmlStream = gulp.src(config.pathSrcHtmlSpecimen)
            .pipe(consolidate('underscore', templateData))
            .pipe(insert.prepend(`<!--${config.generatedWarning}-->\n`))
            .pipe(gulp.dest(config.pathDestHtmlSpecimen));

        onFinished(merge(scssStream, htmlStream), function(err) {
            cb(err);
        });
    }

    gulp.src([config.pathSrcSvg])
        .pipe(iconfont({
            fontName     : config.fontFaceName,
            appendUnicode: false,
            normalize    : true,
        }))
        .on('glyphs', buildTemplates)
        .pipe(gulp.dest(config.pathDestFonts));
}

module.exports = generateFont;

