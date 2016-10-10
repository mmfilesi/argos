/**
 * @namespace jsonUtils
 * @description utils to work with collections (arrays and objects)
 */

'use strict';

const jsonUtils = (function() {

  const module    = {};
  const self      = module;

  module.copyObject = (obToCopy)=> {
    return JSON.parse(JSON.stringify(obToCopy));
  };

  module.findInArray = (_array_, valueToFind)=> {
    let i   = 0;
    let len = _array.length;

    for(; i<len; i++) {
      if ( valueToFind === _array_[i] ) {
        return _array_[i];
      }
    }
    return false;
  };

  module.findInObject = (_array_, key, value)=> {
    let i   = 0;
    let len = _array_.length;

    for(; i<len; i++) {
      for (let prop in _array_[i] ) {
        if ( prop === key && _array_[i][prop] === value ) {
          return _array_[i];
        }
      }
    }
    return false;
  };


  return {
    copyObject:     module.copyObject,
    findInArray:    module.findInArray,
    findInObject:   module.findInObject
  };

})();
