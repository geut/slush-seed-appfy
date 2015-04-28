var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    path = require('path'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber');

/**
 * PostCSS plugins
 */
var postcssImport = require('postcss-import'),
    postcssUrl = require('postcss-url'),
    nano = require('cssnano');


/**
 * Gulp task to process the css files usign PostCSS and cssnext
 * @param  {object} config Global configuration
 * @return {function}       Function task
 */
module.exports = function (config) {
    var plumberOptions = {};
    if (config.notify.onError) {
        plumberOptions.errorHandler = notify.onError("PostCSS Error: <%= error.message %>");
    }

    //TODO: check the sourcemap problems
    return function () {
        var processors = [
            postcssImport(),
            postcssUrl({
                url: 'copy'
            }),
            nano()
        ];

        var stream = gulp.src(path.join(config.sourcePath, config.entryCss))
            .pipe(plumber(plumberOptions))
            .pipe( postcss(processors, {
                map: config.debug || false,
                to: path.join(config.destPath, config.entryCss)
            }) )
            .pipe(gulp.dest(config.destPath));

        if (config.notify.onUpdated) {
            return stream.pipe(notify("PostCSS Bundle - Updated"));
        }

        return stream;
    };
};
