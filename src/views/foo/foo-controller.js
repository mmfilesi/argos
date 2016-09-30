(function(window) {

  'use strict';

  /**
   * @namespace fooController
   * @description
   */
  const fooController  = (function() {

    const module    = {};
    const self      = module;

    module.init = ()=> {
      log.success('foo controller :: init');
      self.loadTemplate();
    };

    module.loadTemplate = ()=> {
      let dataOk            = self.prepareData();
      let source            = document.getElementById('js-foo-template').innerHTML;
      let template          = Handlebars.compile(source);
      let compiledTemplate  = template(dataOk);

      //////////// PASAR TODO ESTO A UN MÉTODO RENDERTEMPLATE

      compiledTemplate += '<span id=\'js-checkRender\'></span>';
      document.getElementById('argos-main-stage').innerHTML = compiledTemplate;

    };

    module.prepareData = ()=> {

      };

    return {
      init: module.init
    };

  })();

  /* "exportar" solo el contenido que se maneje desde fuera
  del falso módulo */
  window['fooController'] = fooController;
})(window);
