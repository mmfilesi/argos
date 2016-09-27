'use strict';

/**
 * @namespace logErrors
 * @description get and set application global data
 * todo: send errors to server
 */
const logErrors = (function() {

  const module    = {};
  const self      = module;

  module.init = ()=> {
    self.addListeners();
  };

  module.addListeners = ()=> {
    window.onerror = function(message, source, lineno, colno, error) {
      let msg =
        `error: ${message}
        file: ${source}
        line: ${lineno}
        col: ${colno}
        error: ${error}`;
        log.error(msg)
    }
  };

  return {
    init: module.init
  };

})();
