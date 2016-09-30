'use strict';

/**
 * @namespace globals
 * @description get and set application global data
 */
const globals = (function() {

  const module    = {};
  const self      = module;

  module.allStates  = [];
  module.allTexts   = {};

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
    let uri          = './shell/theme/states.json';;

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

  return {
    getAllStates:    module.getAllStates,
    loadAllStates:   module.loadAllStates,
    getCurrentState: module.getCurrentState,
    setCurrentState: module.setCurrentState,
    getTexts:     module.getTexts,
    loadTexts:    module.loadTexts
  };

})();
