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

 //recupera el valor de un param recibido por GET
  module.getParam = function(name){
    let regExp = new RegExp('[\&|\?]'+name+'=([^\&\#]+)');
    let param  = window.location.search.match(regExp);

    return param ? param[1]:  '';
  };

  //formatea una tarjeta de crédito que llegue sin guiones
  module.formatCard = function(number){
    if(number){
      return number.toString().match(/\d{1,4}/g).join('-');
    }
  };

  return {
    viewPort: module.viewPort,
    getParam: module.getParam,
    formatCard: module.formatCard
  };

})();
