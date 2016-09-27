/**
 * @namespace ApiRest
 * @return {undefined}
 * @param {object} [optionsOverride] Set default options
 * optionsOverride = {
    'type': 'application/json',
    'headers': [{'key': 'foo', 'value': 'bar'}],
    'charset': 'ASCII',
    'showPreload': true,
    'errorInterceptor': true
    }
  };
 *
 * @description class for api rest.
 */

class ApiRest {

  constructor(optionsOverride) {
    this.options = optionsOverride ? this._setOptions(optionsOverride) : restUtils.getOptionsDefault();
  }

  _setOptions(optionsOverride) {
    let prop;
    let optionsDefault = restUtils.getOptionsDefault();

    for (prop in optionsOverride) {
      if ( optionsDefault.hasOwnProperty(prop) ) {
        optionsDefault[prop] = optionsOverride[prop];
      }
    }
    return optionsDefault;
  }

  _setHeaders(req) {
    let i = 0;
    let len;

    if ( this.options.hasOwnProperty('type') ) {
      req.setRequestHeader('Content-Type', this.options.type +'; charset='+this.options.charset);
    }
    if ( this.options.hasOwnProperty('headers') && this.options.headers.length ) {
      len = this.options.headers.length;
      for (; i<len; i++ ) {
        req.setRequestHeader(this.options.headers[i].key, this.options.headers[i].value);
      }
    }
    return req;
  }

  _doRequest(resource, verb, aditionalData) {
    let deferred  = Q.defer();
    let req           = new XMLHttpRequest();
    let queryString   = verb === 'GET' && typeof aditionalData === 'object' ? restUtils.prepareQueryString(aditionalData) : '';
    let postData      = verb !== 'GET' && aditionalData ? JSON.stringify(aditionalData) : '';
    let serverResponse = {};

    req.open(verb, resource + queryString, true);
    req = this._setHeaders(req);

    req.onreadystatechange = (e)=> {
      if ( req.readyState !== 4 ) {
        return;
      }
      serverResponse = restUtils.prepareResponse(e, req, this.options);

      if ( !serverResponse.isValid && this.options.errorInterceptor ) {
          restUtils.showErrorServer(serverResponse.errorDescription);
          deferred.reject(serverResponse.errorDescription);

      } else {
        if ( this.options.showPreload ) {
          restUtils.hidePreloader();
        }
       deferred.resolve(serverResponse.content);
      }
    }

    if ( this.options.showPreload ) {
      restUtils.showPreloader();
    }

    req.send(postData);
    return deferred.promise;
  }

  getResource(resource, queryString) {
    return this._doRequest(resource, 'GET', queryString);
  }

  postResource(resource, postData) {
    return this._doRequest(resource, 'POST', postData);
  }

  putResource(resource, putData) {
    return this._doRequest(resource, 'PUT', putData);
  }

  deleteResource(resource, deleteData) {
    return this._doRequest(resource, 'DELETE', deleteData);
  }

}
