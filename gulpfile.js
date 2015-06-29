const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const consolidate = require('gulp-consolidate');
const onFinished = require('finished');

const config = {
    fontFaceName: 'testfont',
};

gulp.task('font', function generateFont(cb) {
    function generateCss(glyphs, options) {
        var stream = gulp.src('templates/foodAssembGlyphs.scss')
            .pipe(consolidate('underscore', {
                glyphs  : glyphs,
                fontName: config.fontFaceName,
                fontPath: '../fonts/',
            }))
            .pipe(gulp.dest('build/sass'));
            // .on('complete', function() { cb(); console.log('youpi');});

        onFinished(stream, function(err) {
            console.log(err);
            cb();
        });
    }

    gulp.src(['svg/*.svg'])
        .pipe(iconfont({
            fontName     : config.fontFaceName,
            appendUnicode: true,
        }))
        .on('glyphs', generateCss)
        .pipe(gulp.dest('build/fonts/'));
});

gulp.task('default', ['font'], function() {
    console.log('finished');
});
