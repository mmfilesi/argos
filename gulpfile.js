'use strict';

const gulp              = require('gulp');
const babel             = require('gulp-babel');
const browserSync       = require('browser-sync').create();
const concat            = require('gulp-concat');
const uglify            = require('gulp-uglify');
const sourcemaps        = require('gulp-sourcemaps');
//const imagemin          = require('gulp-imagemin');
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

const baseSrc     = './src/';
const baseDist    = './dist/';
const pathsSrc    = {};
const pathsDist   = {};


pathsSrc.shell       = baseSrc + 'shell/';
pathsDist.shell      = baseDist + 'shell/';

pathsSrc.theme      = pathsSrc.shell + 'theme/';
pathsDist.theme     = pathsDist.shell + 'theme/';

pathsSrc.core       = pathsSrc.shell + 'argos/**/argos*.js';
pathsDist.core      = pathsDist.shell + 'argos/';

pathsSrc.views       = baseSrc + 'shell/theme/views/**/*';
pathsDist.views      = baseDist + 'shell/theme/views/';

pathsSrc.rootFiles   = [
  './src/favicon.ico',
  './src/robots.txt',
  './src/license.txt',
  './src/sw.js'
];

/* Añadir aquí todas las librerías vendor estrictamente necesarias
para que funcione la aplicación  nada más cargar (el resto, por lazy load en app.js) */
pathsSrc.vendor     = [
  pathsSrc.shell + 'vendor/q/q.js',
  pathsSrc.shell + 'vendor/handlebars/handlebars.js'
];

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

/* Separamos los task del builder en tres grupos:
- los archivos "estáticos" que en teoría apenas cambian a lo largo del desarrollo (ie, vendor)
- los estilos
- los js
De esta manera, se puede jugar en el watcher para aliviar el proceso */

gulp.task('buildStatics', (done)=> {

  /* librerías vendor :: esto al final lo hacemos con el useref */
  // gulp.src( pathsSrc.vendor )
  //   .pipe( concat('all-libraries.js', optionsConcat) )
  //   .pipe(gulp.dest(baseDist + 'shell/vendor'));

    if ( ENVIROMENT !== 'production' ) {
      gulp.src(baseSrc + 'mocks/**/*.json')
        .pipe(gulp.dest(baseDist + 'mocks/'));
    }

    /* configuración general */
    gulp.src(pathsSrc.rootFiles)
      .pipe(gulp.dest(baseDist));

    /* core */
    gulp.src(pathsSrc.core)
      .pipe(sourcemaps.init())
      .pipe(babel({
            presets: ['es2015']
        }))
      .pipe( concat('argos.min.js', optionsConcat) )
      .pipe( ENVIROMENT === 'production' ? uglify(optionsUglify) :  gutil.noop() )
      .pipe(sourcemaps.write('./'))
      .pipe( gulp.dest(pathsDist.core) );

    /* Archivos de configuración del tema */
    gulp.src(pathsSrc.theme + '*.json')
      .pipe(gulp.dest(pathsDist.theme));

  done();
});

gulp.task('buildTheme', (done)=> {
  let themeSources = [baseSrc + 'shell/theme/*.js', baseSrc + 'shell/theme/models/**/*.js'];

    gulp.src(themeSources)
     .pipe(sourcemaps.init())
      .pipe(babel({
            presets: ['es2015']
        }))
      .pipe( concat('app.min.js', optionsConcat) )
      .pipe( ENVIROMENT === 'production' ? uglify(optionsUglify) :  gutil.noop() )
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(pathsDist.theme));

    gulp.src(pathsSrc.views  + '**/*.html' )
      .pipe(gulp.dest(pathsDist.views));

    gulp.src(pathsSrc.theme + 'langs/**/*.json')
      .pipe(gulp.dest(pathsDist.theme + 'langs/'));

  done();
});

  /* De momento va sin sass */
  gulp.task('buildStyles', (done)=> {
    gulp.src(pathsSrc.theme + 'styles/css/**/*.css')
      .pipe(concat('styles.css'))
      .pipe( ENVIROMENT === 'develop' ? sourcemaps.init() :  gutil.noop() )
      .pipe(cleanCSS())
      .pipe(concat('styles.min.css'))
      .pipe( ENVIROMENT === 'develop' ? sourcemaps.write() :  gutil.noop() )
      .pipe(gulp.dest(pathsDist.theme + 'styles/'));

      gulp.src(pathsSrc.theme + 'styles/img/**/*.*')
      .pipe(gulp.dest(pathsDist.theme + 'styles/img'));

      done();
  });

  /* El index hay que separarlo, ya que el useref reemplazaría los archivos transpilados
  por los originales */
  gulp.task('buildIndex', (done)=> {
      // gulp.src(baseSrc + 'index.html')
      // .pipe(useref())
      // .pipe(gulp.dest(baseDist));
      // done();
  });

/* ========================
  task - builder
======================== */

gulp.task('clean', (done)=> {
  gulp.src(baseDist + '*', {read: false})
    .pipe(clean());
  done();
});

gulp.task('build', gulp.series(
  'clean',
 // 'buildIndex',
  'buildStatics',
  'buildTheme',
  'buildStyles',
  (done)=> {
    done();
  }));

gulp.task('default', gulp.series('build'), (done)=> {
  gutil.log('Gulp is running!');
  done();
});
