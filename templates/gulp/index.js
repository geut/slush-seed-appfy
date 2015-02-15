/**
 * Gulp module.
 * @module gulp
 */
var gulp = require( 'gulp' ),
    config = require( './config.json' ),
    path = require( 'path' ),
    util = require( 'util' );

function formatEntries( sourcePath, entries ) {
    var list = [];
    if ( !(util.isArray(entries)) ) {
        list.push(entries);
    } else {
        list = entries;
    }

    for (var i=0,len=list.length;i < len;i++) {
        list[i] = path.join( sourcePath, list[i] );
    }

    return list;
}

/**
 * Autosettings
 */
config.sourcePath = path.join( __dirname, '..', config.sourcePath );
config.entriesJs = formatEntries( config.sourcePath, config.entriesJs );
config.entriesCss = formatEntries( config.sourcePath, config.entriesCss );
config.bundlePath = path.join( __dirname, '..', config.bundlePath );
config.reworkAssets.dest = path.join( config.bundlePath, config.reworkAssets.dest );

/**
 * Default environment
 */
config.env = 'dev';

/**
 * Gulp task definitions
 */
gulp.task( 'clean', require( './tasks/clean.js' )( config ) );
gulp.task( 'browserify', require( './tasks/browserify.js' )( config ) );
gulp.task( 'rework-css', require( './tasks/rework-css.js' )( config ) );
gulp.task( 'browser-sync', require('./tasks/browser-sync.js')( config ) );
gulp.task( 'watch-files', require('./tasks/watch-files.js')( config ) );

gulp.task( 'dev', require('./tasks/dev.js')( config ) );
gulp.task( 'build', require('./tasks/build.js')( config ) );
gulp.task( 'serve', require('./tasks/serve.js')( config ) );

gulp.task( 'default', [ 'serve' ] );