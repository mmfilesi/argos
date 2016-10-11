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

  return {
    copyObject:   module.copyObject,
    findInObject: module.findInObject
  };

})();
