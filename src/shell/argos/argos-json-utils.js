'use strict';

/**
 * @namespace jsonUtils
 * @description utils to work with collections (arrays and objects)
 */

const jsonUtils = (function () {

  const module = {};
  const self = module;

  module.copyObject = (obToCopy) => {
    return JSON.parse(JSON.stringify(obToCopy));
  };

  module.findInArray = (_array_, valueToFind) => {
    let i = 0;
    let len = _array.length;

    for (; i < len; i++) {
      if (valueToFind === _array_[i]) {
        return _array_[i];
      }
    }
    return false;
  };

  module.findInObject = (_array_, key, value) => _array_.find(item => item[key] === value);

  return {
    copyObject: module.copyObject,
    findInArray: module.findInArray,
    findInObject: module.findInObject

  };

})();