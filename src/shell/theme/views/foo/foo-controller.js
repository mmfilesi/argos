(function(window) {

  'use strict';

  /**
   * @namespace fooController
   * @description
   */
  const fooController  = (function() {

    const module    = {};
    const self      = module;

    let allCountries = [];

    module.init = ()=> {
      log.success('foo controller :: init');
      countriesFactory.getCountries().then( (data)=> {
        allCountries = data;
        self.loadTemplate();
      });
    };

    module.loadTemplate = ()=> {
      let data      = self.prepareData();
      let source    = 'js-foo-template';
      let container = 'argos-main-stage';

      viewsUtils.renderTemplate(data, source, container);
      self.removeListeners();
      self.addListeners();
    };

    module.prepareData = ()=> {
      let allData = {};
      let texts   = globals.getTexts();

      allData.texts     = {};
      allData.texts.ok  = texts.ok;

      return allData;
    };

    module.removeListeners = ()=> {
    };

    module.addListeners = ()=> {
    };

    return {
      init: module.init
    };

  })();

  /* "exportar" solo el contenido que se maneje desde fuera
  del falso módulo */
  window['fooController'] = fooController;
})(window);
