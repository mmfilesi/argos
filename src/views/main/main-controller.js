(function(window) {

  'use strict';

  /**
   * @namespace mainController
   * @description
   */
  const mainController  = (function() {

    const module    = {};
    const self      = module;

    module.init = ()=> {
      log.success('main controller :: init');
      self.loadTemplate();
    };

    module.loadTemplate = ()=> {
      let dataOk            = self.prepareData();
      let source            = document.getElementById('js-main-template').innerHTML;
      let template          = Handlebars.compile(source);
      let compiledTemplate  = template(dataOk);

      //////////// PASAR TODO ESTO A UN MÉTODO RENDERTEMPLATE

      compiledTemplate += '<span id=\'js-checkRender\'></span>';
      document.getElementById('argos-main-stage').innerHTML = compiledTemplate;

      document.getElementById('js-buttonFoo').onclick = ()=>{

        router.stateGo('foo')
      }

  //     Ak().onRender('#js-checkRender').then(function() {
  //        self.removeListeners();
  //        self.addListeners();
  //        Ak('#js-checkRender').remove();
  //      });

    };

    module.prepareData = ()=> {

      };

    return {
      init: module.init
    };

  })();

  /* "exportar" solo el contenido que se maneje desde fuera
  del falso módulo */
  window['mainController'] = mainController;
})(window);
