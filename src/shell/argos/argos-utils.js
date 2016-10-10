/**
 * @namespace utils
 * @description La idea es que este módulo vaya creciendo con utilidades generales.
 */

'use strict';

const utils = (function() {

  const module    = {};
  const self      = module;

  /**
  * @memberof utils#
  * @method
  * @name viewPort
  * @description Devuelve el navegador del cliente: isAndroid, isiOS, isFirefox,isMobile
  * @return {object}
  */
  module.viewPort = ()=> {
    let isAndroid = navigator.userAgent.match(/Android/i) !== null;
    let isiOS     = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)/i) !== null;
    let isFirefox = navigator.userAgent.match(/Firefox/i) !== null;
    let isMobile  = isiOS || isAndroid;

    let getNavigator = {
      'isAndroid': isAndroid,
      'isiOS': isiOS,
      'isMobile': isMobile,
      'isFirefox': isFirefox
    };
    return getNavigator;
  };

  return {
    viewPort: module.viewPort
  };

})();
