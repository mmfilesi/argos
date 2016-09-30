'use strict';

/**
 * @namespace log
 * @description secure console.log
 */
const log = (function() {

  const module    = {};
  const self      = module;

  const environment = config.getEnvironment();

  module.success = (msg)=> {
    if ( msg && environment !== 'production' ) {
      console.log('%c'+ msg, 'color: #45a163');
    }
  };

  module.log = (msg)=> {
    if ( msg && environment !== 'production' ) {
      console.log('%c'+ msg, 'color: #005999');
    }
  };

  module.warning = (msg)=> {
    if ( msg && environment !== 'production' ) {
      console.log('%c'+ msg, 'color: #f48024');
    }
  };

  module.error = (msg)=> {
    if ( msg && environment !== 'production' ) {
      console.log('%c'+ msg, 'color: #f42424');
    }
  };

  module.table = (msg)=> {
    if ( msg && environment !== 'production' ) {
      console.table(msg);
    }
  };

  return {
    success:  module.success,
    log:      module.log,
    warning:  module.warning,
    error:    module.error,
    table:    module.table
  };

})();
