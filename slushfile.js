/*
 * slush-seed-appfy
 * https://github.com/geut/slush-seed-appfy
 *
 * Copyright (c) 2015, Geut
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require( 'gulp' ),
    install = require( 'gulp-install' ),
    conflict = require( 'gulp-conflict' ),
    template = require( 'gulp-template' ),
    rename = require( 'gulp-rename' ),
    gulpFilter = require( 'gulp-filter' ),
    _ = require( 'underscore.string' ),
    inquirer = require( 'inquirer' );

function format( string ) {
    var username = string.toLowerCase();
    return username.replace( /\s/g, '' );
}

var defaults = ( function () {
    var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
        workingDirName = process.cwd().split( '/' ).pop().split( '\\' ).pop(),
        osUserName = homeDir && homeDir.split( '/' ).pop() || 'root',
        configFile = homeDir + '/.gitconfig',
        user = {};
    if ( require( 'fs' ).existsSync( configFile ) ) {
        user = require( 'iniparser' ).parseSync( configFile ).user;
    }
    return {
        appName: workingDirName,
        userName: format( user.name ) || osUserName,
        authorEmail: user.email || ''
    };
} )();

gulp.task( 'default', function ( done ) {
    var prompts = [ {
        name: 'appName',
        message: 'What is the name of your project?',
        default: defaults.appName
    }, {
        name: 'appDescription',
        message: 'What is the description?'
    }, {
        name: 'appVersion',
        message: 'What is the version of your project?',
        default: '1.0.0'
    }, {
        name: 'authorName',
        message: 'What is the author name?',
    }, {
        name: 'authorEmail',
        message: 'What is the author email?',
        default: defaults.authorEmail
    }, {
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?'
    } ];

    //Ask
    inquirer.prompt( prompts, function ( answers ) {
        if ( !answers.moveon ) {
            return done();
        }
        answers.appNameSlug = _.slugify( answers.appName );
        var d = new Date();
        answers.year = d.getFullYear();
        answers.date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();

        var templatesToChange = gulpFilter( ['*', '!gulp'] );

        gulp.src( __dirname + '/templates/**/*' )
            .pipe( templatesToChange )
            .pipe( template( answers ) )
            .pipe( templatesToChange.restore() )
            .pipe( rename( function ( file ) {
                if ( file.basename[ 0 ] === '_' ) {
                    file.basename = '.' + file.basename.slice( 1 );
                }
            } ) )
            .pipe( conflict( './' ) )
            .pipe( gulp.dest( './' ) )
            .pipe( install() ).on( 'end', function () {
                done();
            } );
    } );
} );