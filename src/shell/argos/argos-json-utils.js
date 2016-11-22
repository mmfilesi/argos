/**
 * @namespace jsonUtils
 * @description utils to work with collections (arrays and objects)
 */

'use strict';

const jsonUtils = (function() {
  const module  = {};
  const self    = module;

  module.copyObject = (obToCopy)=> {
    return JSON.parse(JSON.stringify(obToCopy));
  };

  module.findInObject = (_array_, key, value) => _array_.find(item => item[key] === value);

  /*
   * @memberof jsonUtils#
   * @name encodeObject
   * @description Codifica el JSON para guardarlo en una propiedad HTML
   */
  module.encodeObject = (json) => {
    return JSON.stringify(json).replace(new RegExp('"', 'g'), "'");
  };
  /*
   * @memberof jsonUtils#
   * @name decodeObject
   * @description Decodifica el JSON guardado en una propiedad HTML
   */
  module.decodeObject = (json) => {
    return dataUtils.copyJSON(json.replace(new RegExp("'", 'g'), '"'));
  };

  /*
   * @memberof jsonUtils#
   * @name getObject
   * @description Busca dentro de un listado de objetos por key y valor
   */
  module.getObject= function(obj, key, val) {
    var objects = [],
      i;

    for (i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      if (typeof obj[i] === 'object') {
        objects = objects.concat(module.getObjecs(obj[i], key, val));
      } else
      //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
      if (i === key && obj[i] === val || i === key && val === '') {
        objects.push(obj);
      } else if (obj[i] === val && key === '') {
        //only add if the object is not already in the array
        if (objects.lastIndexOf(obj) === -1) {
          objects.push(obj);
        }
      }
    }
    return module.copyObject(objects);
  };

  return {
    copyObject:   module.copyObject,
    findInObject: module.findInObject,
    encodeObject: module.encodeObject,
    decodeObject: module.decodeObject,
    getObject:    module.getObject
  };

})();
