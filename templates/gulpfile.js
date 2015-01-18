var browserSync = require('browser-sync'),
  browserify = require('browserify'),
  csso = require('gulp-csso'),
  del = require('del'),
  gulp = require('gulp'),
  gutil = require('gulp-util')
  rework = require('gulp-rework'),
  reworkAssets = require('rework-assets')
  reworkNpm = require('rework-npm'),
  runSequence = require('run-sequence'),
  source = require('vinyl-source-stream'),
  streamify = require('gulp-streamify'),
  uglify = require('gulp-uglify'),
  watch = require('gulp-watch'),
  env = 'dev',
  config = {
    entriesCss: './src/index.css',
    entriesJs: './src/index.js', 
    dev: {
      css: {
        sourcemap: true,
        minify: false
      },
      js: {
        debug: true,
        uglify: false
      }
    },
    prod: {
      css: {
        sourcemap: false,
        minify: true
      },
      js: {
        debug: false,
        uglify: true
      }
    }
  };

gulp.task('clean', taskClean);
gulp.task('browserify', taskBrowserify);
gulp.task('dev', taskDev);
gulp.task('build', taskBuild);
gulp.task('browser-sync', ['clean', 'dev'], taskBrowserSync);
gulp.task('serve', ['browser-sync'], taskServe);
gulp.task('default', ['serve']);

function taskClean(cb) {
  del('dist', cb);
}

function taskBrowserify() {
  var bundler = browserify({
    entries: config.entriesJs, 
    debug: config[env].js.debug
  });

  var stream = bundler.bundle()
    .pipe(source('index.js'));

  if ( config[env].js.uglify ) {
    stream.pipe( streamify(uglify()) );
  }

  return stream.pipe(gulp.dest('dist'));
}

gulp.task('rework-css', function() {
  var stream = gulp.src(config.entriesCss)
    .pipe(
      rework(
        reworkNpm(),
        reworkAssets({
          dest: 'dist/assets',
          prefix: 'assets/'
        }),
        { 
          sourcemap: config[env].css.sourcemap 
        }
      )
    );

  if ( config[env].css.minify ) {
    stream.pipe(csso());
  }

  return stream.pipe(gulp.dest('dist'));
});

function taskDev() {
  env = 'dev';
  runSequence('browserify', 'rework-css');
}

function taskBuild() {
  env = 'prod';
  runSequence('clean', 'browserify', 'rework-css');
}

function taskBrowserSync() {
  browserSync({
    server: {
      baseDir: './'
    }
  });
}

function taskServe() {
  watch(['index.html', 'src/**/*'], function () {
    runSequence( 'dev', browserSync.reload );
  });
}