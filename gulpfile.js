/* todos:
  sass
  el imagemin no chufla
*/

const gulp              = require('gulp');
const browserSync       = require('browser-sync').create();
const concat            = require('gulp-concat');
const uglify            = require('gulp-uglify');
const sourcemaps        = require('gulp-sourcemaps');
const imagemin          = require('gulp-imagemin');
const clean             = require('gulp-clean');
const gutil             = require('gulp-util');
const useref            = require('gulp-useref');

/* ====================================
  Conts && Options
==================================== */

const ENVIROMENT = 'develop';

const optionsUglify = {
  mangle: true
};

const optionsConcat = {
  newLine: ';'
};

const optionsServer = {
  port: 9090,
  server: {
    baseDir: './dist',
    index: 'index.html'
  }
};


/* ====================================
  Paths
==================================== */

const baseSrc     = './src/';
const baseDist    = './dist/';
const pathsSrc    = {};
const pathsDist   = {};

pathsDist.theme     = baseDist + 'theme/';

pathsSrc.core       = baseSrc + 'shell/argos/**/argos*.js';
pathsDist.core      = baseDist + 'shell/argos/';

pathsSrc.index      = baseSrc + 'index.html';
pathsDist.index     = baseDist;

pathsSrc.views       = baseSrc + 'views/**/*';
pathsDist.views      = baseDist + 'views/';

pathsSrc.configFiles   = [
  './src/shell/theme/*.json',
  './src/shell/theme/*.js'
];

pathsSrc.rootFiles   = [
  './src/favicon.ico',
  './src/robots.txt',
  './src/license.txt',
  './src/sw.js'
];

pathsSrc.images     = baseSrc + 'shell/styles/img/*';
pathsDist.images    = baseDist + 'shell/styles/img/';

pathsSrc.mocks      = baseSrc + 'mocks/**/*.json';
pathsDist.mocks     = baseDist + 'mocks/';

pathsSrc.vendor     = [
  './src/shell/vendor/q/q.js',
  './src/shell/vendor/d3/d3.min.js'
];

pathsDist.vendor    = baseDist + 'shell/vendor';

// todo: pathsSrc.sass        = 'sass/**/*.sass';

/* ====================================
  Tasks
==================================== */


/* ========================
  task - builder
======================== */

  gulp.task('buildRootFiles', (done)=> {
      gulp.src(pathsSrc.rootFiles)
      .pipe(gulp.dest(baseDist));
      done();
  });

  gulp.task('buildCore', (done)=> {
    gulp.src(pathsSrc.core)
      .pipe(sourcemaps.init())
      .pipe( concat('argos.min.js', optionsConcat) )
      .pipe( ENVIROMENT === 'production' ? uglify(optionsUglify) :  gutil.noop() )
      .pipe(sourcemaps.write('./'))
      .pipe( gulp.dest(pathsDist.core) );
    done();
  });

  gulp.task('buildIndex', (done)=> {
      gulp.src(pathsSrc.index)
      .pipe(useref())
      .pipe(gulp.dest(pathsDist.index));
      done();
  });

  gulp.task('buildViews', (done)=> {
    gulp.src(pathsSrc.views)
      .pipe(gulp.dest(pathsDist.views));

    gulp.src(pathsSrc.configFiles)
      .pipe(gulp.dest(pathsDist.theme));

     done();
  });

  gulp.task('buildMocks', (done)=> {
    if ( ENVIROMENT !== 'production' ) {
      gulp.src(pathsSrc.mocks)
        .pipe(gulp.dest(pathsDist.mocks));
    }
     done();
  });

  gulp.task('buildVendor', (done)=> {
    gulp.src(pathsSrc.vendor)
      .pipe( concat('all-libraries.js', optionsConcat) )
      .pipe(gulp.dest(pathsDist.vendor));
    done();
  });

  gulp.task('buildImages', (done)=> {
    gulp.src(pathsSrc.images)
      .pipe(imagemin())
      .pipe(gulp.dest(pathsDist.images));
  });

/* ========================
  #task - builder
======================== */

gulp.task('build', gulp.parallel(
  'buildRootFiles',
  'buildCore',
  'buildIndex',
  'buildViews',
  'buildVendor',
  //'buildMocks',
  //'buildImages',
  (done)=> {
    done();
  }));

gulp.task('clean', (done)=> {
  gulp.src(baseDist + '/*', {read: false})
    .pipe(clean());
  done();
});

gulp.task('default', gulp.series('clean', 'build'), (done)=> {
  gutil.log('Gulp is running!');
  done();
});

