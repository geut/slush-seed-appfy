var gulp = require( 'gulp' ),
    browserify = require( 'browserify' ),
    watchify = require( 'watchify' ),
    browserSync = require( 'browser-sync' ),
    uglify = require( 'gulp-uglify' ),
    streamify = require( 'gulp-streamify' ),
    source = require( 'vinyl-source-stream' ),
    path = require( 'path' ),
    notify = require( 'gulp-notify' ),
    util = require('gulp-util');

/**
 * Gulp task to run browserify over config.entriesJs
 * @param  {object} config Global configuration
 * @return {function}        Function task
 */
module.exports = function ( config ) {
    var onBundleError;
    if ( config.notify.onError ) {
        onBundleError = notify.onError( "Browserify Error: <%= error.message %>" );
    } else {
        onBundleError = function ( err ) {
            util.log(util.colors.red('Error'), err.message);
        };
    }

    /**
     * Function to run the Browserify Bundler over pipes
     * @param  {object} bundler Bundler object
     * @return {object} stream  Gulp stream
     */
    function browserifyBundle( bundler ) {
        var stream = bundler.bundle()
            .on( "error", onBundleError )
            .pipe( source( 'index.js' ) );

        if ( config[ config.env ].js.uglify ) {
            stream.pipe( streamify( uglify() ) );
        }

        stream = stream.pipe( gulp.dest( config.bundlePath ) );

        if ( config.notify.onUpdated ) {
            return stream.pipe( notify( "Browserify Bundle - Updated" ) );
        }

        return stream;
    }

    return function () {
        var bundler = browserify( {
            entries: config.entriesJs,
            debug: config[ config.env ].js.debug,
            cache: {},
            packageCache: {},
            fullPaths: true
        } );

        if ( config.watchify ) {
            bundler = watchify( bundler );

            bundler.on( 'update', function () {

                browserifyBundle( bundler )
                    .pipe( browserSync.reload( {
                        stream: true
                    } ) );

            } );
        }

        return browserifyBundle( bundler );
    };
};