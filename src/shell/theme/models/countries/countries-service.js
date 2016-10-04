  'use strict';

  /**
   * @namespace countriesService
   * @description
   */
  const countriesService  = (function() {

    const module    = {};
    const self      = module;

    module.loadCountries = ()=> {
      let instanceRest  = new ApiRest();
      let deferred      = Q.defer();
      let uri           = globals.getRest().getCapital;

      /* todo: control de tokens */
      instanceRest.getResource(uri).then(
        (data)=> {
          deferred.resolve(data);
        },
        (error)=> {
          msg.showErrorServer(error);
          deferred.reject(error);
        });
      return deferred.promise;
    };


    return {
      loadCountries: module.loadCountries
    };

  })();
