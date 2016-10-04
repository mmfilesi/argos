  'use strict';

  /**
   * @namespace countriesFactory
   * @description
   */
  const countriesFactory  = (function() {

    const module    = {};
    const self      = module;

    module.allCountries = {
      'loaded': false,
      'data': []
    };

    module.getCountries = ()=> {
      let deferred = Q.defer();

      if ( self.allCountries.loaded ) {
        deferred.resolve(self.allCountries.data);
      } else {
        countriesService.loadCountries().then(
          (data)=> {
          self.allCountries.data = data;
          deferred.resolve(self.allCountries.data);
          },
         (error)=> {
            msg.showErrorServer(error);
          });
      }
      return deferred.promise;
    };

    module.resetCountries = ()=> {
      self.allCountries.loaded = false;
      self.allCountries.data   = [];
    };

    return {
      getCountries:   module.getCountries,
      resetCountries: module.resetCountries
    };

  })();
