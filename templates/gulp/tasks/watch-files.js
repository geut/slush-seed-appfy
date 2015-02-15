var watch = require( 'gulp-watch' ),
    browserSync = require( 'browser-sync' ),
    path = require( 'path' ),
    runSequence = require( 'run-sequence' );

/**
 * Gulp task to watch files
 * @param  {object} config Global configuration
 * @return {function}      Function task
 */
module.exports = function ( config ) {
    var stylesSourceWatch = [ 
        path.join( config.sourcePath, 'node_modules/**/*.+(css|jpeg|png|eot|svg|ttf|woff|woff2)' ), 
        path.join( config.sourcePath, 'styles/**/*' )
    ].concat( config.entriesCss );

    return function () {
        watch( path.join( __dirname, '../..', 'index.html' ), function () {
            runSequence( 'dev', browserSync.reload );
        } );

        watch( stylesSourceWatch, function () {
            runSequence( 'rework-css', browserSync.reload );
        } );
    };
};