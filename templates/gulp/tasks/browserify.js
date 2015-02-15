var gulp = require( 'gulp' ),
    browserify = require( 'browserify' ),
    watchify = require( 'watchify' ),
    browserSync = require( 'browser-sync' ),
    uglify = require( 'gulp-uglify' ),
    streamify = require( 'gulp-streamify' ),
    source = require( 'vinyl-source-stream' ),
    path = require( 'path' ),
    notify = require( 'gulp-notify' );

/**
 * Gulp task to run browserify over config.entriesJs
 * @param  {object} config Global configuration
 * @return {function}        Function task
 */
module.exports = function ( config ) {

    /**
     * Function to run the Browserify Bundler over pipes
     * @param  {object} bundler Bundler object
     * @return {object} stream  Gulp stream
     */
    function browserifyBundle( bundler ) {
        var stream = bundler.bundle()
            .on( "error", notify.onError( "Browserify Error: <%= error.message %>" ) )
            .pipe( source( 'index.js' ) );

        if ( config[ config.env ].js.uglify ) {
            stream.pipe( streamify( uglify() ) );
        }

        return stream
            .pipe( gulp.dest( config.bundlePath ) )
            .pipe( notify( "Browserify Bundle - Updated" ) );
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