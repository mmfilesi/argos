'use strict';

/**
 * @namespace utilsJson
 * @description utils to work with collections (arrays and objects)
 */

const utils = (function() {

  const module    = {};
  const self      = module;

   /*
   * @memberof utils#
   * @description Objeto donde se almacenarán las expresiones regulares
   * @property {object}
   */
  module.regExp = {
    yearPeriod: '(^19[0-9]{2}|2[0-9]{3}$)',
    DMYperiod: '((^\d{1,1})+[dDmMyY]{1,1}$)|((^\d{2,2})+[dDmMyY]{1,1}$)',
    decimalsDot: '(^[0-9]*[\.]*[0-9]*$)',
    decimals: '(^[0-9]+[\.|\,]*[0-9]*[\.|\,]*[0-9]*[\.|\,]*[0-9]*$)',
    decimalsPN: '(^(-?[0-9]{1,9})$)|(^[0-9]{1,9}$)|(^([0-9]{1,9})+(\.|\,)+([0-9]{1,6})$)|(^(-?[0-9]{1,9})+(\.|\,)+([0-9]{1,6})$)'
  };

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

   /*
   * @memberof utilsJson#
   * @name getListValue
   * @description Metodo que busca un valor dentro de un listado (Helper Handlebars)
   */
  module.getListValue = function(key, list) {
    var i = 0,
      length = list.length,
      value = '';

    for (; length > i; i++) {
      if (key === list[i].value) {
        value = list[i].value;
        i = length;
      }
    }

    return value;
  };

  /*
   * @memberof utilsJson#
   * @name isSelected
   * @description Selecciona un elemento de un combo (Helper Handlebars)
   */
  module.isSelected= function(key, selectedKey) {
    return key === selectedKey ? 'selected' : '';
  };

  /*
   * @memberof dataUtils#
   * @name handlebarsHelpers
   * @description Metodo que agrupa todos los helpers de handelbars
   */
  module.handlebarsHelpers=function(){
    Handlebars.registerHelper('isSelected', module.isSelected);
    Handlebars.registerHelper('getListValue', module.getListValue);
    Handlebars.registerHelper('encodeObject', jsonUtils.encodeObject);
  };

  return {
    viewPort: module.viewPort,
    getParam: module.getParam,
    formatCard: module.formatCard,
    regExp: module.regExp,
    handlebarsHelpers:module.handlebarsHelpers
  };

})();
