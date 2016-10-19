'use strict';

/**
 * @namespace globals
 * @description get and set application global data
 */
const globals = (function() {

  const module    = {};
  const self      = module;

  module.allStates    = [];
  module.allTexts     = {};
  module.allEndPoints = {};

  module.currentState = {
		'state': 'main',
  	'section': ''
	};

  module.getAllStates = ()=> {
    return self.allStates;
  };

  module.loadAllStates = ()=> {
    let instanceRest = new ApiRest();
    let deferred     = Q.defer();
    let uri          = './shell/theme/states.json';

    instanceRest.getResource(uri).then(
      (data)=> {
        self.allStates = data.states;
        deferred.resolve(data);
      },
      (error) => {
        log.error('error get states: '+ error);
        deferred.reject();
      });
    return deferred.promise;
  };

  module.setCurrentState = (_state_, _section_)=> {
    if ( !_state_) {
      log.warning('dont set state if stage is not defined');
      return;
    }
    self.currentState.state    = _state_;
    self.currentState.section  =  _section_ ? _section_ : '';
  };

  module.getCurrentState = ()=> {
    return self.currentState;
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

  module.loadRest = ()=> {
    let instanceRest = new ApiRest();
    let deferred     = Q.defer();
    let lang         = config.getLang();
    let uri          = './shell/theme/rest.json';

    instanceRest.getResource(uri).then(
      (data)=> {
        self.prepareRest(data);
        deferred.resolve();
      },
      (error) => {
        log.error('error load config rest: '+ error);
        deferred.reject();
      });
    return deferred.promise;
  };

  module.prepareRest = (data)=> {
    let environment = config.getEnvironment();
    let prefix      = data.generalData.baseUrl[environment];
    let suffix      = data.generalData.type[environment];

    for (let prop in data.endPoints[environment]) {
      self.allEndPoints[prop] = prefix + data.endPoints[environment][prop] + suffix;
    }

  };

  module.getRest = ()=> {
    return self.allEndPoints;
  };

  return {
    getAllStates:     module.getAllStates,
    loadAllStates:    module.loadAllStates,
    getCurrentState:  module.getCurrentState,
    setCurrentState:  module.setCurrentState,
    getTexts:         module.getTexts,
    loadTexts:        module.loadTexts,
    loadRest:         module.loadRest,
    getRest:          module.getRest
  };

})();
