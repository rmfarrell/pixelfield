//initialize all of our variables
var app, base, concat, directory, coffee, gulp, gutil, hostname, path, refresh, sass, uglify, imagemin, minifyCSS, del, browserSync, autoprefixer, gulpSequence, shell, sourceMaps;

var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

//load all of our dependencies
//add more here if you want to include more libraries
gulp = require('gulp');
gutil = require('gulp-util');
concat = require('gulp-concat');
uglify = require('gulp-uglify');
coffee = require('gulp-coffee');
sourceMaps = require('gulp-sourcemaps');
imagemin = require('gulp-imagemin');
minifyCSS = require('gulp-minify-css');
browserSync = require('browser-sync');
autoprefixer = require('gulp-autoprefixer');
gulpSequence = require('gulp-sequence').use(gulp);
shell = require('gulp-shell');
stylus = require('gulp-stylus')

gulp.task('browserSync', function() {
  browserSync({
    open: false,
    proxy: 'localhost:3000',
    options: {
      reloadDelay: 250
    },
    notify: false
  });
});


//compressing images & handle SVG files
gulp.task('images', function(tmp) {
  gulp.src(['app/images/*.jpg', 'app/images/*.png'])
  .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
  .pipe(gulp.dest('app/images'));
});

//compressing images & handle SVG files
gulp.task('images-deploy', function() {
  gulp.src(['app/images/**/*', '!app/images/README'])
  .pipe(gulp.dest('dist/images'));
});

//compiling our Javascripts
gulp.task('scripts', function() {
    //this is where our dev JS scripts are
    return gulp.src(['src/scripts/classes/*.coffee','src/scripts/*.coffee'])
      .pipe(coffee({bare: true}).on('error', gutil.log))
      .pipe(concat('app.js'))
      .on('error', gutil.log)
      .pipe(gulp.dest('public/scripts'))
      .pipe(browserSync.reload({stream: true}));
    });

//compiling our Javascripts for deployment
gulp.task('scripts-deploy', function() {
    //this is where our dev JS scripts are
    return gulp.src(['app/scripts/src/_includes/**/*.js', 'app/scripts/src/**/*.js'])
                //this is the filename of the compressed version of our JS
                .pipe(concat('app.js'))
               //compress :D
               .pipe(uglify())
               //where we will store our finalized, compressed script
               .pipe(gulp.dest('dist/scripts'));
             });

//compiling our SCSS files
gulp.task('styles', function () {
  gulp.src(['./src/styles/style.styl'])
    .pipe(stylus({
      // compress: true
    }))
    .pipe(gulp.dest('./public/styles'));
});

gulp.task('html', function() {
  return gulp.src('./views/**/*.jade')
    .pipe(browserSync.reload({stream: true}))
    .on('error', gutil.log);
});

//migrating over all HTML files for deployment
gulp.task('html-deploy', function() {
    //grab everything, which should include htaccess, robots, etc
    gulp.src('app/*')
    .pipe(gulp.dest('dist'));

    //grab any hidden files too
    gulp.src('app/.*')
    .pipe(gulp.dest('dist'));

    gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

    //grab all of the styles
    gulp.src(['app/styles/*.css', '!app/styles/styles.css'])
    .pipe(gulp.dest('dist/styles'));
  });

//cleans our dist directory in case things got deleted
gulp.task('clean', function() {
  return shell.task([
    'rm -rf dist'
    ]);
});

//create folders using shell
gulp.task('scaffold', function() {
  return shell.task([
    'mkdir dist',
    'mkdir dist/fonts',
    'mkdir dist/images',
    'mkdir dist/scripts',
    'mkdir dist/styles'
    ]
    );
});

//this is our master task when you run `gulp` in CLI / Terminal
//this is the main watcher to use when in active development
//  this will:
//  startup the web server,
//  start up browserSync
//  compress all scripts and SCSS files
gulp.task('default', ['browserSync','scripts', 'styles', 'html'], function() {
    //a list of watchers, so it will watch all of the following files waiting for changes
    gulp.watch('src/scripts/*.coffee', ['scripts']);
    gulp.watch('src/styles/**/*.styl', ['styles']);
    // gulp.watch('app/images/**', ['images']);
    gulp.watch('views/**/*.jade', ['html']);
  });

//this is our deployment task, it will set everything for deployment-ready files
gulp.task('deploy', gulpSequence('clean', 'scaffold', ['scripts-deploy', 'styles-deploy', 'images-deploy'], 'html-deploy'));