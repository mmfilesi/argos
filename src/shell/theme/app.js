'use strict';

/**
 * @namespace bootstrap
 * @description Starting the application
 */
const bootstrap = (function() {

  const module    = {};
  const self      = module;

  module.initAll = ()=> {
    logErrors.init();
    if ( config.getServiceWorkers().active ) {
      self.initWorkers();
    }

    self.loadMainData().then( ()=> {
      self.initProxy();
    });
  };

  module.initWorkers = ()=> {
    /* Comprobamos si el navegador soporta service workers */
    if ('serviceWorker' in navigator) {
      log.log('Service Worker is supported');

      /* En ese caso, registramos nuestro sw mediante el método register(),
      que devuelve una promesa */
      navigator.serviceWorker.register('./sw.js')
        .then( (registration)=> {
          log.success('sw registered: ', registration);

      }).catch( (err)=> {
          log.warning('Service Worker registration failed: ', err);
      });
    }
  };

  /* Place here all request ajax as promisses are necessarily to start the applications */
  module.loadMainData = ()=> {
    let deferred     = Q.defer();
    let allPromisses = [globals.loadTexts(), globals.loadAllStates(), globals.loadRest()];

    Q.all(allPromisses).then( (results)=> {
      log.success('main data loaded');
      deferred.resolve();
    }, (error)=> {
      log.error('error get main data');
      deferred.reject();
    });

    return deferred.promise;
  };

  module.initProxy = ()=> {
    let configRoutes  = config.getOptionsState()
    let location      = window.location.pathname !== '/' ? window.location.pathname.split('/').pop() : '';
    let hash          = window.location.hash ? window.location.hash.replace('#', '') : '';
    let state         = hash ? hash : location ? location : false;

    /* Inicializamos el router */
    router.init();

    /* Redirigimos donde toque */
    if ( configRoutes.forceEntry ) {
      router.stateGo(configRoutes.defaultState);
    } else if ( state && router.stateIsDefined(state) ) {
      router.stateGo(state);
    } else {
      router.stateGo('main');
    }
  };

  return {
    initAll: module.initAll
  };

})();

document.addEventListener('DOMContentLoaded', ()=> {
  config.init().then( ()=> {
    bootstrap.initAll();
  });
});
