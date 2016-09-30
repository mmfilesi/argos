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

  module.checkIsSupported = ()=> {
    if ('history' in window && 'pushState' in history) {
      return true;
    }
    return false;
  };

   module.selectHash = ()=> {
    let pathname  = location.pathname;
    let i         = 0;
    let len       = self.routes.length;
    let hashArr   = location.hash;

    if (hashArr === '') {
      for (i, len; i < len; i++) {
        if(self.routes[i].url === pathname){
          return self.routes[i];
        }
      }
    }
    return self.findRoute();
  };

   module.findRoute = ()=> {
    let route   = location.hash.replace('#', '').split('::').shift();
    let i       = 0;
    let  len    = self.routes.length;

    for (; i<len; i++) {
      if ( self.routes[i].state === route ) {
        return self.routes[i];
      }
    }
    return self.routes[0];
  };

  /* todo: si al final quito los params, simplificar */
  module.executeFunction = (functionName, context)=> {
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

  module.setRoute = ()=> {
    let routeHash   = self.selectHash();
    let argumentsFn = location.hash.indexOf('::') !== -1 ? location.hash.split('::').pop() : '';
    let  routeGlobal = '';

    /* Esto permite que los enlaces anchor normales,
    que no están mapeados en el config, funcionen. */
    if ( !routeHash ) {
      return;
    }

    routeGlobal       = ( location.hash.split('::').shift() ).split('/');
    route.stage       = routeGlobal[0].replace('#', '');
    route.section     = routeGlobal[1];
    route.subsection  = routeGlobal[3];

    argumentsFn = argumentsFn !== '' ? argumentsFn : routeHash.hasOwnProperty('params') ? routeHash.params : undefined;
    argumentsFn = argumentsFn ? argumentsFn.split(',') : undefined;
    self.executeFunction(routeHash.controller, window, argumentsFn);
    history.replaceState(routeHash, routeHash.state, routeHash.url);
  };

  module.addListeners = ()=> {
    window.addEventListener('hashchange', ()=> {
      self.setRoute();
    });
  };

  /* todo: ojo, params */
  module.stateGo = (stage, params)=> {
    window.location.hash = stage+'::'+params;
  };

  module.init = (configRoutes)=> {
    if ( !self.checkIsSupported() ) {
      msg.showError('browser deprecated', 'No support api navigation');
      return;
    }

    self.titleApp   = document.title || 'app';
    self.routes     = configRoutes;

    self.addListeners();
    self.setRoute();
  };
