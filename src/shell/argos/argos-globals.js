'use strict';

/**
 * @namespace globals
 * @description get and set application global data
 */
const globals = (function() {

  const module    = {};
  const self      = module;

  module.allRoutes  = {};
  module.allTexts   = {};

  module.getRoutes = ()=> {
    return self.allRoutes;
  };

  module.loadRoutes = ()=> {
    let instanceRest = new ApiRest();
    let deferred     = Q.defer();
    let uri          = './shell/theme/routes.json';;

    instanceRest.getResource(uri).then(
      (data)=> {
        self.allRoutes = data;
        deferred.resolve(data);
      },
      (error) => {
        log.error('error get routes: '+ error);
        deferred.reject();
      });
    return deferred.promise;
  };

  module.getTexts = ()=> {
    return self.allTexts;
  };

  module.loadTexts = ()=> {
    let instanceRest = new ApiRest();
    let deferred     = Q.defer();
    let lang         = config.getLang();
    let uri          = './shell/theme/langs/' + lang + '.json';

    instanceRest.getResource(uri).then(
      (data)=> {
        self.allTexts = data;
        deferred.resolve(data);
      },
      (error) => {
        log.error('error loadTexts: '+ error);
        deferred.reject();
      });
    return deferred.promise;
  };

  return {
    getRoutes:    module.getRoutes,
    loadRoutes:   module.loadRoutes,
    getTexts:     module.getTexts,
    loadTexts:    module.loadTexts
  };

})();
