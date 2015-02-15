var gulp = require( 'gulp' ),
    rework = require( 'gulp-rework' ),
    reworkAssets = require( 'rework-assets' )
    reworkNpm = require( 'rework-npm' ),
    csso = require( 'gulp-csso' ),
    notify = require( 'gulp-notify' ),
    plumber = require( 'gulp-plumber' );

/**
 * Gulp task to process the css files usign Rework
 * @param  {object} config Global configuration
 * @return {function}       Function task
 */
module.exports = function ( config ) {
    return function () {
        var stream = gulp.src( config.entriesCss )
            .pipe( plumber( {
                errorHandler: notify.onError( "Rework CSS Error: <%= error.message %>" )
            } ) )
            .pipe(
                rework(
                    reworkNpm(),
                    reworkAssets( config.reworkAssets ), {
                        sourcemap: config[ config.env ].css.sourcemap
                    }
                )
        );

        if ( config[ config.env ].css.minify ) {
            stream.pipe( csso() );
        }

        return stream
            .pipe( gulp.dest( config.bundlePath ) )
            .pipe( notify( "Rework CSS Bundle - Updated" ) );
    };
};