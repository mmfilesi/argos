/**
 * @namespace config
 * @description Módulo para gestionar los datos de configuración iniciales de la aplicación, los cuales se definen en ./src/theme/config.json
 */

'use strict';

const config = (function() {

  let module  = {};
  let self    = module;

  /**
  * @memberof config#
  * @name _configGeneral
  * @description Objeto privado con la configuración general.
  * @property {string} environment El entorno de trabajo: develop, production, test, etcétera.
  * @property {string} lang El idioma por defecto (para seleccionar los textos definidos en .src/shell/theme/langs)
  */
  module._configGeneral  = {
		'environment': 'develop',
		'lang': 'en_En'
  };

  /**
  * @memberof config#
  * @name _optionsState
  * @description Objeto privado para configurar las opciones de la navegación por estados
  * @property {boolean} forceEntry Si debe cargarse un estado por defecto al entrar en la web.
  * @property {string} defaultState El estado que debe cargarse por defecto.
  */
	module._optionsState = {
    'forceEntry': false,
    'defaultState': 'main'
	};

  /**
  * @memberof config#
  * @name _serviceWorkers
  * @description Objeto privado para gestionar los service workers
  * @property {boolean} active Si cargan o no.
  */
  module._serviceWorkers = {
    'active': false
  };

  /**
  * @memberof config#
  * @method
  * @name init
  * @description Método público para cargar la configuración definida en el config.json del theme.
  * @return {object} Devuelve una promesa.
  */
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
        self._initAll(data);
        deferred.resolve();
      },
      (error) => {
        log.error('error get config data: '+ error);
        deferred.reject();
      });
      return deferred.promise;
  };

  /**
  * @memberof config#
  * @method
  * @name _initAll
  * @description Método privado para distribuir los seteos de config.json.
  */
  module._initAll = (data)=> {
    self._configGeneral.environment  = data.generalData.environment;
    self._configGeneral.lang         = data.generalData.lang;
    self._serviceWorkers.active      = data.serviceWorkers.active;

    if ( data.rest.hasOwnProperty('restOptions') ) {
      restUtils.setOptionsDefault(data.rest.restOptions);
    }
    if ( data.rest.hasOwnProperty('specialCodes') ) {
      restUtils.setSpecialCodes(data.rest.specialCodes);
    }
    if (  data.hasOwnProperty('optionsState') && data.optionsState.hasOwnProperty('forceEntry') ) {
      self._optionsState.forceEntry    = data.optionsState.forceEntry;
      self._optionsState.defaultState  = data.optionsState.defaultState;
    }
  };

  /**
  * @memberof config#
  * @method
  * @name getOptionsState
  * @description Método público para recuperar las opciones de la navegación por estados.
  * @return {object}
  */
  module.getOptionsState = () => {
    return self._optionsState;
  };

  /**
  * @memberof config#
  * @method
  * @name getServiceWorkers
  * @description Método público para recuperar las opciones relacionadas con los service workers.
  * @return {object}
  */
  module.getServiceWorkers = () => {
    return self._serviceWorkers;
  };

  /**
  * @memberof config#
  * @method
  * @name getEnvironment
  * @description Método público que devuelve el environment.
  * @return {string}
  */
  module.getEnvironment = ()=> {
    return self._configGeneral.environment;
  };

  /**
  * @memberof config#
  * @method
  * @name getLang
  * @description Método público que devuelve el idioma definido en config.json.
  * @return {string}
  */
  module.getLang  = ()=> {
    return self._configGeneral.lang;
  };

  return {
    init:               module.init,
    getOptionsState:    module.getOptionsState,
    getEnvironment:     module.getEnvironment,
    getLang:            module.getLang,
    getServiceWorkers:  module.getServiceWorkers
  };

 } )();
