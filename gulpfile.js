'use strict';

const gulp   = require('gulp');
const sass   = require('gulp-sass');
const insert = require('gulp-insert');
const config = require('./config');
const path   = require('path');


gulp.task('font', function generateFont(cb) {
    require('./index.js')(cb);
});

gulp.task('css', ['font'], function() {
    gulp.src(path.join(config.pathDestBase, config.pathDestScss, 'main.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(insert.prepend(`/*${config.generatedWarning}*/\n`))
        .pipe(gulp.dest('build/specimen'));
});

gulp.task('default', ['font', 'css'], function() {
    console.log('finished');
});
