'use strict';

/* todos:
  sass
  el imagemin no chufla
*/

const gulp              = require('gulp');
const babel             = require('gulp-babel');
const browserSync       = require('browser-sync').create();
const concat            = require('gulp-concat');
const uglify            = require('gulp-uglify');
const sourcemaps        = require('gulp-sourcemaps');
// const imagemin          = require('gulp-imagemin');
const cleanCSS          = require('gulp-clean-css');
const clean             = require('gulp-clean');
const gutil             = require('gulp-util');
const useref            = require('gulp-useref');
const jsdoc             = require('gulp-jsdoc3');

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

'use strict';

const baseSrc     = './src/';
const baseDist    = './dist/';
const pathsSrc    = {};
const pathsDist   = {};

pathsSrc.theme      = baseSrc + 'shell/theme/';
pathsDist.theme     = baseDist + 'shell/theme/';

pathsSrc.core       = baseSrc + 'shell/argos/**/argos*.js';
pathsDist.core      = baseDist + 'shell/argos/';

pathsSrc.index      = baseSrc + 'index.html';
pathsDist.index     = baseDist;

pathsSrc.views       = baseSrc + 'shell/theme/views/**/*';
pathsDist.views      = baseDist + 'shell/theme/views/';

pathsSrc.conFiles   = baseSrc + 'shell/theme/*.json';
pathsDist.conFiles  = baseDist + 'shell/theme/';

pathsSrc.rootFiles   = [
  './src/robots.txt',
  './src/humans.txt',
  './src/license.txt',
  './src/sw.js',
  './src/favicon.ico',
  './src/crossdomain.xml',
  './src/404.html',
  './src/.htaccess'
];

pathsSrc.images     = baseSrc + 'shell/styles/img/*';
pathsDist.images    = baseDist + 'shell/styles/img/';

pathsSrc.styles     = baseSrc + 'shell/theme/styles/css/**/*';
pathsDist.styles    = baseDist + 'shell/theme/styles/';

pathsSrc.mocks      = baseSrc + 'mocks/**/*.json';
pathsDist.mocks     = baseDist + 'mocks/';

pathsSrc.vendor     = [
  './src/shell/vendor/q/q.js'
];

pathsDist.vendor    = baseDist + 'shell/vendor';

/* ====================================
  Tasks
==================================== */

gulp.task('doc', (done)=> {
  const options = {
    'tags': {
      'allowUnknownTags': true
    },
    'opts': {
      "destination": './docs/'
    }
  }

  gulp.src(['README.md', './src/shell/argos/**/*.js'], options)
    .pipe(jsdoc());
  done();
});

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
      .pipe(babel({
            presets: ['es2015']
        }))
      .pipe( concat('argos.min.js', optionsConcat) )
      .pipe( ENVIROMENT === 'production' ? uglify(optionsUglify) :  gutil.noop() )
      .pipe(sourcemaps.write('./'))
      .pipe( gulp.dest(pathsDist.core) );
      done()
  });

  gulp.task('buildIndex', (done)=> {
      gulp.src(pathsSrc.index)
      .pipe(useref())
      .pipe(gulp.dest(pathsDist.index));
      done();
  });

  gulp.task('buildConfigFiles', (done)=> {
    gulp.src(pathsSrc.conFiles)
      .pipe(gulp.dest(pathsDist.conFiles));
     done();
  });

  gulp.task('buildTheme', (done)=> {
    gulp.src(pathsSrc.views  + '**/*.js' )
      .pipe(babel({
            presets: ['es2015']
        }))
      .pipe(gulp.dest(pathsDist.views));

    gulp.src(pathsSrc.views  + '**/*.html' )
      .pipe(gulp.dest(pathsDist.views));

    let themeSources = [baseSrc + 'shell/theme/*.js', baseSrc + 'shell/theme/models/**.*.js'];

    gulp.src(pathsSrc.theme  + '**/*.js' )
     .pipe(sourcemaps.init())
      .pipe(babel({
            presets: ['es2015']
        }))
      .pipe( concat('app.min.js', optionsConcat) )
      .pipe( ENVIROMENT === 'production' ? uglify(optionsUglify) :  gutil.noop() )
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(pathsDist.theme));

    done();
  });

  gulp.task('buildModels', (done)=> {
    gulp.src('./src/shell/theme/models/**/*.js')
      .pipe(gulp.dest('./dist/shell/theme/models/'));
     done();
  });

  gulp.task('buildMocks', (done)=> {
    if ( ENVIROMENT !== 'production' ) {
      gulp.src('./src/mocks/**/*.json')
        .pipe(gulp.dest('./dist/mocks/'));
    }
     done();
  });

  gulp.task('buildStatics', (done)=> {
    gulp.src('./src/shell/theme/langs/**/*.json')
      .pipe(gulp.dest('./dist/shell/theme/langs/'));
     done();
  });

  /* De momento va sin sass */
  gulp.task('buildStyles', (done)=> {
    gulp.src(pathsSrc.styles)
      .pipe(concat('styles.css'))
      .pipe( ENVIROMENT === 'develop' ? sourcemaps.init() :  gutil.noop() )
      .pipe(cleanCSS())
      .pipe(concat('styles.min.css'))
      .pipe( ENVIROMENT === 'develop' ? sourcemaps.write() :  gutil.noop() )
      .pipe(gulp.dest(pathsDist.styles));

      gulp.src('./src/shell/theme/styles/img/**/*.*')
      .pipe(gulp.dest('./dist/shell/theme/styles/img')); 

      done();
  });

  gulp.task('buildVendor', (done)=> {
    gulp.src(pathsSrc.vendor)
      .pipe( concat('all-libraries.js', optionsConcat) )
      .pipe(gulp.dest(pathsDist.vendor));
    done();
  });

/* ========================
  #task - builder
======================== */

gulp.task('clean', (done)=> {
  gulp.src(baseDist + '/*', {read: false})
    .pipe(clean());
  done();
});

gulp.task('build', gulp.series(
  'buildRootFiles',
  'buildCore',
  'buildIndex',
  'buildTheme',
  'buildVendor',
  'buildConfigFiles',
  'buildMocks',
  'buildModels',
  'buildStyles',
  'buildStatics',
  (done)=> {
    done();
  }));

gulp.task('default', gulp.series('build'), (done)=> {
  gutil.log('Gulp is running!');
  done();
});
