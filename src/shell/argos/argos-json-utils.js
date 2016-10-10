/**
 * @namespace jsonUtils
 * @description utils to work with collections (arrays and objects)
 */

<<<<<<< HEAD
'use strict';

const jsonUtils = (function() {
=======
const jsonUtils = (function () {
>>>>>>> ee91d969004d9ca2f45f912f986b655b8a417665

  const module  = {};
  const self    = module;

  module.copyObject = (obToCopy)=> {
    return JSON.parse(JSON.stringify(obToCopy));
  };

  module.findInObject = (_array_, key, value) => _array_.find(item => item[key] === value);

  return {
<<<<<<< HEAD
    copyObject:     module.copyObject,
    findInArray:    module.findInArray,
    findInObject:   module.findInObject
=======
    copyObject:   module.copyObject,
    findInObject: module.findInObject
>>>>>>> ee91d969004d9ca2f45f912f986b655b8a417665
  };

})();