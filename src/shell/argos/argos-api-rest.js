/**
 * @namespace ApiRest
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
 * @description Esta clase sirve para gestionar las llamadas rest.
 * Una vez sacada una instancia, podemos acceder a los métodos get, post, put y delete.
 * Un ejemplo con promesas:
 *
 *  ```javascript
    module.loadCountries = ()=> {
      let instanceRest  = new ApiRest();
      let deferred      = Q.defer();
      let uri           = globals.getRest().getCapital;

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
    ```
  * En cada instancia podemos sobreescribir las opciones por defecto que se definen en .src/config.json, que de momento son:
  - _type_: el tipo mime (ie, application/json).
  - _headers_: un array de objetos key-value con las cabeceras que se añadirán de forma automática.
  Por ejemplo:
    ```
      [{
        "key": "GS-AUTH-TOKEN",
        "value": "123456"
      }]
    ```
  - _showPreload_: si se muestra o no un preloader de forma automática cada vez que se dispara un request (pendiente las css, por cierto)
  - _errorInterceptor_: si se gestionan o no de manera automática los errores indicados en el response (por status o código preestablecido)
  *
  * __todo__:
  - implementar las promesas en los métodos de la clase (?)
  - control de un token caducado.
  - añadir más verbos rest.
 */

class ApiRest {

  constructor(optionsOverride) {
    this.options = optionsOverride ? this._setOptions(optionsOverride) : restUtils.getOptionsDefault();
  }

  /**
  * @memberof ApiRest#
  * @method
  * @name _setOptions
  * @description Método privado para gestionar las opciones por defecto.
  */
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

  /**
  * @memberof ApiRest#
  * @method
  * @name _setHeaders
  * @description Método privado para modificar los headers del request.
  */
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

  /**
  * @memberof ApiRest#
  * @method
  * @name  _doRequest
  * @description Método privado para realizar la petición ajax.
  */
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

  /**
  * @memberof ApiRest#
  * @method
  * @name getResource
  * @param {string} resource. URL del recurso.
  * @param {array} [queryString]. Un array de objetos que se añaden como query string (también se puede indicar directamente en el resource)
  * @return {undefined}
  * @description Método público para realizar las peticiones GET.
  */
  getResource(resource, queryString) {
    return this._doRequest(resource, 'GET', queryString);
  }

  /**
  * @memberof ApiRest#
  * @method
  * @name postResource
  * @param {string} resource. URL del recurso.
  * @param {object} [postData]. Un json con los datos a enviar.
  * @return {undefined}
  * @description Método público para realizar las peticiones POST.
  */
  postResource(resource, postData) {
    return this._doRequest(resource, 'POST', postData);
  }

  /**
  * @memberof ApiRest#
  * @method
  * @name putResource
  * @param {string} resource. URL del recurso.
  * @param {object} [postData]. Un json con los datos a enviar.
  * @return {undefined}
  * @description Método público para realizar las peticiones PUT.
  */
  putResource(resource, putData) {
    return this._doRequest(resource, 'PUT', putData);
  }


  /**
  * @memberof ApiRest#
  * @method
  * @name deleteResource
  * @param {string} resource. URL del recurso.
  * @param {object} [postData]. Un json con los datos a enviar.
  * @return {undefined}
  * @description Método público para realizar las peticiones DELETE.
  */
  deleteResource(resource, deleteData) {
    return this._doRequest(resource, 'DELETE', deleteData);
  }

}
