const gulp          = require('gulp');
const browserSync   = require('browser-sync').create();
const concat        = require('gulp-concat');
const uglify        = require('gulp-uglify');
const sourcemaps    = require('gulp-sourcemaps');
const imagemin      = require('gulp-imagemin');
const clean         = require('gulp-clean');
const gutil         = require('gulp-util');
const useref        = require('gulp-useref');


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

pathsSrc.core       = baseSrc + 'shell/argos/**/argos*.js';
pathsSrc.index   = baseSrc;

pathsDist.core      = baseDist + 'shell/argos/';
pathsDist.index      = baseDist + 'index.html';

// pathsSrc.scripts     = baseSrc + 'app/**/*.js';
// pathsSrc.templates   = baseSrc + 'app/**/*.html';
// pathsSrc.assets      = baseSrc + 'app/assets/';
// pathsSrc.mocks       = baseSrc + 'mocks/**/*.json';
// pathsSrc.vendor      = baseSrc + 'vendor/**/*.js';
// pathsSrc.sass        = 'sass/**/*.sass';
// 
// pathsDist.scripts    = baseDist + 'app/scripts';
// pathsDist.vendor     = baseDist + 'app/vendor';
// pathsDist.templates  = baseDist + 'app/';
// pathsDist.mocks      = baseDist + 'mocks/';

/* ====================================
  Tasks 
==================================== */

/* Builder */

gulp.task('clean', (done)=> {
  gulp.src(baseDist + '/*', {read: false})
    .pipe(clean());
  done();
});

gulp.task('prepareCore', (done)=> {
  gulp.src(pathsSrc.core)
    .pipe(sourcemaps.init())
    .pipe( concat('argos.min.js', optionsConcat) )
    .pipe( ENVIROMENT === 'production' ? uglify(optionsUglify) :  gutil.noop() )
    .pipe(sourcemaps.write('./'))
    .pipe( gulp.dest(pathsDist.core) );
  done();
});

gulp.task('index', (done)=> {
    gulp.src(pathsDist.core)
     .pipe(useref())
    .pipe(gulp.dest(pathsDist.index));
    done();
});

gulp.task('build', gulp.parallel('prepareCore', 'index', (done)=> {
    done();
}));

// , 'server'
gulp.task('default', gulp.series('clean', 'build'), (done)=> {
    gutil.log('Gulp is running!');
    done();
});