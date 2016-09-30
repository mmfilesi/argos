'use strict';

/**
 * @namespace router
 * @description proxy routes
 */
const router = (function() {

  const module    = {};
  const self      = module;

  module.stateSelected = {};

  /**
  * @memberof router#
  * @method
  * @name init
  * @return {undefined}
  * @description init states listeners
  */
  module.init = ()=> {
    if ( !self.checkIsSupported() ) {
      msg.showError('browser deprecated', 'No support api navigation');
      return;
    }
    self.addListeners();
  };

  /**
  * @memberof router#
  * @method
  * @name checkIsSupported
  * @return {boolean}
  * @description check if browser can manage history and pushState,
  * necessary for the system router.
  */
  module.checkIsSupported = ()=> {
    if ('history' in window && 'pushState' in history) {
      return true;
    }
    return false;
  };

  /**
  * @memberof router#
  * @method
  * @name addListeners
  * @return {undefined}
  * @description add listener to hash (#) change
  */
  module.addListeners = ()=> {
    window.addEventListener('hashchange', ()=> {
      self.setRoute();
    });
  };

  /**
  * @memberof router#
  * @method
  * @name setRoute
  * @return {undefined}
  * @description set the url, call lazy load controllers, and call the method defined in routes.json
  */

//// OJO, FALTA CUANDO VIENE X ENLACE

  module.setRoute = ()=> {
    let argumentsFn = self.stateSelected.params ? self.stateSelected.params.split(',') : null;
    let stateSelected;

    /* Si no venimos de stateGo, hay que recuperar los datos */
    if ( !self.stateSelected.stateGo ) {
      stateSelected = self.findRouteByUrl();
      /* Si no hay ningún estado, dejamos pasar para que se puedan usar los hastagh en la página */
      if ( !stateSelected ) {
        return;
      } else {
        self.stateSelected.state    = stateSelected.state;
        self.stateSelected.section  = stateSelected.section;
        self.stateSelected.entry    = stateSelected.entry;
        self.stateSelected.url      = stateSelected.url;
      }
    }

    globals.setCurrentState(self.stateSelected.state, self.stateSelected.section);

    views.loadView(self.stateSelected.state).then( ()=> {
      /* Si al final uso un namespace, pasar este en lugar de window */
      self.executeFunction(self.stateSelected.entry, window, argumentsFn);
      history.replaceState(self.stateSelected, self.stateSelected.state, '#'+self.stateSelected.url);
      self.resetStateSelected();
    });
  };

  module.stateGo = (state, params)=> {
    let currentHash = window.location.hash;

    self.stateSelected = JSON.parse( JSON.stringify(self.findRouteByState(state)) );

    /* Cacheamos aquí los parámetros para pasarlos más adelante */
    self.stateSelected.params = params;

    /* Marcamos que venimos de state go para no duplicar el trabajo más adelante
    y saber que ya tenemos el state seleccionado */
     self.stateSelected.stateGo = true;

    /* Para poder llamar a la misma página debemos chequear si estamos llamando
    al mismo estado */
    if ( currentHash && currentHash.replace('#', '') === self.stateSelected.url ) {
      self.setRoute();
    } else {
      window.location.hash = self.stateSelected.url;
    }
  };

  module.resetStateSelected = ()=>{
    self.stateSelected = {
      'state': '',
      'url': '',
      'entry': '',
      'controllers': [],
      'templates': [],
      'params': '',
      'stateGo': false
    }
  };

  module.getQueryString = ()=> {
    let query      = window.location.search.substring(1);
    let  params    = {};
    let  temp      = [];
    let itemTemp   = [];
    let  i         = 0;
    let  len;

    if ( query === '' ) {
      return false;
    }
    if ( query.indexOf('&') !== -1 ) {
      temp = query.split('&');

    } else {
      temp.push(query);
    }
    len = temp.length;
    for (; i<len; i++ ) {
      itemTemp = temp[i].split('=');
      params[itemTemp[0]] = itemTemp[1];
    }
    return params;
  };

  module.cleanQueryString = ()=> {
    let url = window.location.href;

    url = url.split('?').shift();
    window.history.pushState({},'', url);
  };

  module.executeFunction = (functionName, _context_)=> {
    let context     = _context_ || window;
    let args        = Array.prototype.slice.call(arguments, 2);
    let namespaces  = functionName.split('.');
    let func        = namespaces.pop();
    let i           = 0;
    let len         = namespaces.length;


    for (; i < len; i++) {
      context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
  };

  module.findRouteByUrl = ()=> {
    let states        = globals.getAllStates();
    let len           = states.length;
    let i             = 0;
    let stateSelected = false;
    let hash          = location.hash.replace('#', '');

    for (; i<len; i++) {
      if ( states[i].url === hash ) {
        stateSelected = states[i];
        break;
      }
    }

    return stateSelected;
  };

  module.findRouteByState = (state)=> {
    let states        = globals.getAllStates();
    let len           = states.length;
    let i             = 0;
    let stateSelected = false;

    for (; i<len; i++) {
      if ( states[i].state === state ) {
        stateSelected = states[i];
        break;
      }
    }

    return stateSelected;
  };

  module.stateIsDefined = (state)=> {
    if ( self.findRouteByState() ) {
      return true;
    }
    return false;
  };


  return {
    init:               module.init,
    stateGo:            module.stateGo,
    getQueryString:     module.getQueryString,
    cleanQueryString:   module.cleanQueryString,
    findRouteByState:   module.findRouteByState,
    stateIsDefined:     module.stateIsDefined
  };

} )();
