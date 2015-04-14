var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    cssnext = require('cssnext'),
    path = require('path'),
    notify = require( 'gulp-notify' ),
    plumber = require( 'gulp-plumber' ),
    crypto = require('crypto'),
    mkdirp = require('mkdirp'),
    fs = require('fs');

/**
 * Gulp task to process the css files usign PostCSS and cssnext
 * @param  {object} config Global configuration
 * @return {function}       Function task
 */
module.exports = function (config) {
    var plumberOptions = {};
    if ( config.notify.onError ) {
        plumberOptions.errorHandler = notify.onError( "PostCSS Error: <%= error.message %>" );
    }

    function copyAssets(url, decl) {
        var dirname = decl.source && decl.source.input ? path.dirname(decl.source.input.file) : process.cwd();
        var filePath = path.resolve(dirname, url);
        var assetsPath = path.join(config.destPath, config.assetsPath);

        var resultName = copyHashed(filePath, assetsPath);

        if ( resultName ) {
            return path.join(config.assetsPath, resultName);
        }
        return path.join(config.assetsPath, path.basename(filePath));
    }

    return function () {
        var processors = [
            cssnext({
                url: {
                    url: copyAssets,
                },
                compress: true,
                sourcemap: config.debug || false
            })
        ];

        var stream = gulp.src( path.join(config.sourcePath, config.entryCss) )
            .pipe( plumber( plumberOptions ) )
            .pipe(postcss(processors))
            .pipe(gulp.dest(config.destPath));

        if ( config.notify.onUpdated ) {
            return stream.pipe( notify( "PostCSS Bundle - Updated" ) );
        }

        return stream;
    };
};

function copyHashed( srcFile, destFile ) {
    try {
        fs.accessSync(srcFile);
    } catch(err) {
        return false;
    }

    mkdirp.sync(destFile);

    var contents;
    try {
        contents = fs.readFileSync(srcFile);
    } catch (err) {
        return false;
    }

    var hash = crypto.createHash('sha1')
        .update(contents)
        .digest('hex')
        .substr(0, 16);

    var ext = path.extname(srcFile);
    var name = hash + ext;
    destFile = path.join(destFile, name);

    fs.writeFileSync(destFile, contents);

    return name;
}
