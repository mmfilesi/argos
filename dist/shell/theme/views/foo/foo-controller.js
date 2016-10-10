'use strict';

(function (window) {

  'use strict';

  /**
   * @namespace fooController
   * @description
   */

  var fooController = function () {

    var module = {};
    var self = module;

    var allCountries = [];

    module.init = function () {
      log.success('foo controller :: init');
      countriesFactory.getCountries().then(function (data) {
        allCountries = data;
        self.loadTemplate();
      });
    };

    module.loadTemplate = function () {
      var data = self.prepareData();
      var source = 'js-foo-template';
      var container = 'argos-main-stage';

      viewsUtils.renderTemplate(data, source, container);
      self.removeListeners();
      self.addListeners();
    };

    module.prepareData = function () {
      var allData = {};
      var texts = globals.getTexts();

      allData.texts = {};
      allData.texts.ok = texts.ok;

      return allData;
    };

    module.removeListeners = function () {};

    module.addListeners = function () {};

    return {
      init: module.init
    };
  }();

  /* "exportar" solo el contenido que se maneje desde fuera
  del falso módulo */
  window['fooController'] = fooController;
})(window);