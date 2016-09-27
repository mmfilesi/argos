"use strict";

/*eslint-disable no-unused-vars*/
const config = (function() {
/*eslint-enable no-unused-vars*/

  let module  = {};
  let self    = module;

  module.config  = {
		'environment': 'develop',
		'lang': 'en_En'
  };

	module.route = {
		'stage': '',
  	'section': '',
    'forceEntry': false,
    'defaultState': 'main'
	};

  module.serviceWorkers = {
    'active': false
  };

  module.init = ()=> {
    let deferred = Q.defer();
    let urlConfig = './shell/theme/config.json';
    let restOptions = {
      'type': 'application/json',
      'showPreload': false,
      'errorInterceptor': true
    };
    let instanceRest = new ApiRest(restOptions);

    instanceRest.getResource(urlConfig).then(
      (data)=> {
        self.initAll(data);
        deferred.resolve();
      },
      (error) => {
        log.error('error get config data: '+ error);
        deferred.reject();
      });
      return deferred.promise;
  };

  module.initAll = (data)=> {
    self.config.environment     = data.generalData.environment;
    self.config.lang            = data.generalData.lang;
    self.serviceWorkers.active  = data.serviceWorkers.active;

    if ( data.rest.hasOwnProperty('restOptions') ) {
      restUtils.setOptionsDefault(data.rest.restOptions);
    }
    if ( data.rest.hasOwnProperty('specialCodes') ) {
      restUtils.setSpecialCodes(data.rest.specialCodes);
    }
  };

  module.getServiceWorkers = () => {
    return self.serviceWorkers;
  };

  module.setRoute = (_stage_, _section_)=> {
    if ( !_stage_) {
      log.warning('dont set route if stage is not defined');
      return;
    }
    self.route.stage    = _stage_;
    self.route.section  =  _section_ ?  _section_ : '';
  };

  module.getRoutes = ()=> {
    return self.route;
  };

  module.getEnvironment = ()=> {
    return self.config.environment;
  };

  module.getLang  = ()=> {
    return self.config.lang;
  };

  return {
    init:               module.init,
    setRoute:           module.setRoute,
    getRoutes:          module.getRoutes,
    getEnvironment:     module.getEnvironment,
    getLang:            module.getLang,
    getServiceWorkers:  module.getServiceWorkers
  };

 } )();
