const restUtils = (function() {

  const module    = {};
  const self      = module;

  module.optionsDefault = {
    'type': 'application/json',
    'headers': [],
    'charset': 'utf-8',
    'showPreload': true,
    'errorInterceptor': true
  };

  module.codes = {
    'success': 'san-200',
    'notFound': 'san-404',
    'notAuth': 'san-403',
    'serverError': 'san-500',
    'tokenExpiration': '401',
    'tokenSanExpiration': 'san-441',
    'tokenCorporateExpiration': 'san-442'
  };

  module.prepareResponse = (e, req, options)=> {
    let validation        = {};
    let response          = options.type === 'application/json' ? self.parseResponse(e) : req.responseText;
    let blockingErrors400 = ['403', '405', '406', '413', '414', '415', '416', '417', '429'];
    let blockingErrors500  = /^5/;

    validation.isValid          = true,
    validation.content          = response;
    validation.errorDescription = '';

    if ( blockingErrors500.test(req.status) || blockingErrors400.indexOf(req.status) !== -1 ) {
      validation.isValid          = false;
      validation.errorDescription = req.status.statusText ? req.status.statusText : 'error server';
      return validation;
    }

    if ( !options ) {
      return validation;
    }

    if ( options.type === 'application/json' && !response ) {
      validation.isValid          = false;
      validation.errorDescription = 'error server: bad format json';
      return validation;
    }

    if ( response.hasOwnProperty('result') && response.result.code === self.codes.serverError ) {
      validation.isValid          = false;
      validation.errorDescription = response.result.message ? response.result.message : 'error server';
      return validation;
    }

    return validation;
  };

  module.parseResponse = (e)=> {
    let data = {};

    try {
       data = JSON.parse(e.target.responseText);
    } catch(error) {
      data = null;
      log.error('error parsing data', e);
    }
    return data;
  };

  module.validCode = (result)=> {
    if ( result.code === this.codes.success ) {
      return true;
    }
    return false;
  };

  module.checkTokenExpired = (result)=> {
    if ( result.code === this.codes.tokenSanExpiration ) {
      return true;
    }
    return false;
  };

  // todo, revisar
  module.resetToken = ()=> {
//     let deferred = Q.defer();
//
//     function reset(corporateToken) {
//       restToken.getAuthToken(corporateToken).then(function(data) {
//         restOptions.headers[0].value = data.authToken;
//         deferred.resolve();
//       });
//     }
//
//     if ( !config.tokenUrl ) {
//       restToken.getCorporateToken().then(function(corporateToken) {
//         reset(corporateToken);
//       });
//     } else {
//       reset(corporateToken);
//     }
//     return deferred.promise;
  };

  module.getOptionsDefault = ()=> {
    return JSON.parse(JSON.stringify(self.optionsDefault));
  };

  module.setOptionsDefault = (newOptions)=> {
    let key;

    if ( typeof newOptions !== 'object' ) {
      log.error('new options must be an object');
      return false;
    }
    for ( key in newOptions ) {
      self.optionsDefault.key = newOptions[key]
    }
    return true;
  };

  module.prepareQueryString = (queryString)=> {
    let query   = queryString || {};
    let output  = '?';
    let prop;

    for (prop in query) {
      if ({}.hasOwnProperty.call(query, prop)) {
        output += prop + '=' + query[prop] + '&';
      }
    }
    output = output.length ? output.slice(0, -1) : output;

    return output;
  };

  module.getSpecialCodes = ()=> {
    return self.codes;
  };

  module.setSpecialCodes = (specialCodes)=> {
    self.codes = specialCodes;
  };

  module.showPreloader = function() {
    let preload = document.getElementById('js-mainPreload');

    if ( preload ) {
      preload.style.visibility = "visible";
    }
  };

  module.hidePreloader = function() {
    let preload = document.getElementById('js-mainPreload');

    if ( preload  ) {
      preload.style.visibility = "hidden";
    }
  };

  module.showErrorServer = function(errorMsg) {
    msg.showErrorServer(errorMsg);
  };

  return {
    getOptionsDefault:  module.getOptionsDefault,
    setOptionsDefault:  module.setOptionsDefault,
    getSpecialCodes:    module.getSpecialCodes,
    setSpecialCodes:    module.setSpecialCodes,
    prepareQueryString: module.prepareQueryString,
    prepareResponse:    module.prepareResponse,
    showPreloader:      module.showPreloader,
    hidePreloader:      module.hidePreloader,
    showErrorServer:    module.showErrorServer,
  };

})();
