/**
 * @namespace log
 * @description Módulo con el que usar logs de consola de forma segura, ya que no se muestran en un entorno de producción.
 * Utilizar siempre estos métodos en lugar de console.algo().
 * @example
 * log.error('Error recuperando foo');
 */

'use strict';

const log = (function() {

  const module    = {};
  const self      = module;

  const environment = config.getEnvironment();

  /**
  * @memberof log#
  * @method
  * @name success
  * @description log ok.
  */
  module.success = (msg)=> {
    if ( msg && environment !== 'production' ) {
      console.log('%c'+ msg, 'color: #45a163');
    }
  };

  /**
  * @memberof log#
  * @method
  * @name log
  * @description log normal.
  */
  module.log = (msg)=> {
    if ( msg && environment !== 'production' ) {
      console.log('%c'+ msg, 'color: #005999');
    }
  };

  /**
  * @memberof log#
  * @method
  * @name log
  * @description log warnings.
  */
  module.warning = (msg)=> {
    if ( msg && environment !== 'production' ) {
      console.log('%c'+ msg, 'color: #f48024');
    }
  };

  /**
  * @memberof log#
  * @method
  * @name error
  * @description log ko.
  */
  module.error = (msg)=> {
    if ( msg && environment !== 'production' ) {
      console.log('%c'+ msg, 'color: #f42424');
    }
  };

  /**
  * @memberof log#
  * @method
  * @name table
  * @description log de colecciones.
  */
  module.table = (msg)=> {
    if ( msg && environment !== 'production' ) {
      console.table(msg);
    }
  };

  return {
    success:  module.success,
    log:      module.log,
    warning:  module.warning,
    error:    module.error,
    table:    module.table
  };

})();
