  // RUTAS: ¿cambiamos alguna dinámicamente? */


  module.setRoute = (route)=> {
    let len = self.allRoutes.routes.length;
    let i   = 0;

    if ( !route.hasOwnProperty.state ) {
      throw 'setRoutes: state is not defined';
    }
    if ( !route.hasOwnProperty.url ) {
      throw 'setRoutes: url is not defined';
    }
    if ( !route.hasOwnProperty.controller ) {
      throw 'setRoutes: controller is not defined';
    }
    if ( !route.hasOwnProperty.template ) {
      throw 'setRoutes: template is not defined';
    }

    if ( len ) {
      for (; i<len; i++) {
        if ( route.state === self.allRoutes.routes[i].state ) {
          self.allRoutes.routes[i].url        = route.url;
          self.allRoutes.routes[i].controller = route.controller;
          self.allRoutes.routes[i].template   = route.template;
          return true;
        }
      }
    }

    self.allRoutes.routes.push(route);
    return true;
  };



  module.getRoutes = ()=> {
    let deferred = Q.defer();

    if ( allRoutes.loaded ) {
      deferred.resolve(allRoutes.routes);

    } else {
      self.loadRoutes.then( (data)=> {
        allRoutes.loaded = true;
        allRoutes.routes = data.states;
        deferred.resolve(allRoutes.routes);
      });
    }

    return deferred.promise;
  };


////////////// sacar un langs?

const langs = (function() {

  const module    = {};
  const self      = module;

  module.loadTexts = ()=> {
    let deferred = Q.defer();

    deferred.resolve();
    return deferred.promise;
  };

  return {
    loadTexts:  module.loadTexts
  };
})();





gulp.task('prepareScripts', (done)=> {

  gulp.src(pathsSrc.scripts)
    .pipe(sourcemaps.init())
    .pipe( concat('main.min.js', optionsConcat) )
    // Annotate before uglify so the code get's min'd properly.
    .pipe( ngAnnotate(optionsAnnotate) )
    // .pipe(bytediff.start())
    .pipe( ENVIROMENT === 'production' ? uglify(optionsUglify) :  gutil.noop() )
    //  .pipe(bytediff.stop())
    .pipe(sourcemaps.write('./'))
    .pipe( gulp.dest(pathsDist.scripts) );

  done();
});



gulp.task('build', gulp.parallel('prepareCore', (done)=> {
    done();
}));

// gulp.task('build', gulp.parallel('prepareScripts', 'prepareStatics', (done)=> {
//     done();
// }));
//
/* Server */

gulp.task('server', ()=> {

  browserSync.init(optionsServer);
  //gulp.watch(baseSrc + '/**/*.js').on('change', browserSync.reload);

  gulp.watch(baseSrc + '/**/*.js').on('change', gulp.series('build'), (done)=> {
    browserSync.reload();
    done();
  });

    gulp.watch(baseSrc + '/**/*.html').on('change', gulp.series('build'), (done)=> {
    browserSync.reload();
    done();
  });

});


// gulp.task('default', gulp.series('build', 'server'), (done)=> {
//   gutil.log('Gulp is running!');
//   done();
// });

