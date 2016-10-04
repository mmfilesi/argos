'use strict';

/**
 * @namespace viewstUtils
 * @description utilities views (screens)
 */

const viewsUtils = (function() {

  const module    = {};
  const self      = module;

  module.renderTemplate = function(_data_, _source_, _container_) {
    let source            = document.getElementById(_source_).innerHTML;
    let template          = Handlebars.compile(source);
    let compiledTemplate  = template(_data_);
    let container         = _container_ || 'argos-main-stage';

    document.getElementById(container).innerHTML = compiledTemplate;
  };

  return {
    renderTemplate: module.renderTemplate
  };

})();
