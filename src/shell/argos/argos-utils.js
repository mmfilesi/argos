'use strict';

/**
 * @namespace utilsJson
 * @description utils to work with collections (arrays and objects)
 */

const utils = (function() {

  const module    = {};
  const self      = module;

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
